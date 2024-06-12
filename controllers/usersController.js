const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/usersModel');
const Post = require('../models/postsModel');
const Like = require('../models/likesModel');
const {
  handleResponse,
  handleAppError,
} = require('../middlewares/handleResponses');
const { generateSendJWT } = require('../middlewares/generateJWT');

const users = {
  async signUp(req, res, next) {
    let { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return handleAppError(400, '請填寫所有欄位', next);
    }
    if (password !== confirmPassword) {
      return handleAppError(400, '密碼不一致', next);
    }
    if (typeof name !== 'string') {
      return handleAppError(400, '資料格式錯誤', next);
    }
    if (!validator.isLength(name, { min: 2 })) {
      return handleAppError(400, '暱稱至少 2 個字元以上', next);
    }
    if (!validator.isEmail(email)) {
      return handleAppError(400, 'email格式錯誤', next);
    }
    if (
      !validator.isLength(password, { min: 8 }) ||
      !validator.matches(password, '(?=.*[a-zA-Z])(?=.*\\d)')
    ) {
      return handleAppError(400, '密碼需至少 8 碼以上，並英數混合', next);
    }
    const targetUser = await User.findOne({ email });
    if (targetUser) {
      // 回應統一的錯誤訊息以避免資安問題
      return handleAppError(400, '該帳號已存在', next);
    }
    // 雜湊 Hash Function(要加密的字串, 要加鹽的字串長度)
    password = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password,
    });
    // *可以考慮在這裡發送 Email 驗證信
    // *sendVerificationEmail(newUser);
    generateSendJWT(newUser, 201, '註冊成功', res);
  },
  async signIn(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return handleAppError(400, '帳號與密碼不可為空', next);
    }
    if (!validator.isEmail(email)) {
      return handleAppError(400, 'email格式錯誤', next);
    }
    if (
      !validator.isLength(password, { min: 8 }) ||
      !validator.matches(password, '(?=.*[a-zA-Z])(?=.*\\d)')
    ) {
      return handleAppError(400, '密碼需至少 8 碼以上，並英數混合', next);
    }
    const targetUser = await User.findOne({ email }).select('+password');
    if (!targetUser) {
      // 回應統一的錯誤訊息以避免資安問題
      return handleAppError(400, '帳號或密碼不正確', next);
    }
    const isAuth = await bcrypt.compare(password, targetUser.password);
    if (!isAuth) {
      // 回應統一的錯誤訊息以避免資安問題
      return handleAppError(400, '帳號或密碼不正確', next);
    }
    generateSendJWT(targetUser, 200, '登入成功', res);
  },
  signOut(req, res, next) {
    res.clearCookie('myToken');
    handleResponse(res, 200, '登出成功');
  },
  async getProfile(req, res, next) {
    const targetUser = await User.findById(req.user.id);
    handleResponse(res, 200, '查詢成功', targetUser);
  },
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return handleAppError(400, '請填寫所有欄位', next);
    }
    if (password !== confirmPassword) {
      return handleAppError(400, '密碼不一致', next);
    }
    if (
      !validator.isLength(password, { min: 8 }) ||
      !validator.matches(password, '(?=.*[a-zA-Z])(?=.*\\d)')
    ) {
      return handleAppError(400, '密碼需至少 8 碼以上，並英數混合', next);
    }
    const newPassword = await bcrypt.hash(password, 12);
    const targetUser = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });
    generateSendJWT(targetUser, 201, '密碼更新成功', res);
  },
  async updateProfile(req, res, next) {
    const { name, gender, photo } = req.body;
    if (!name) {
      return handleAppError(400, '匿稱為必填', next);
    }
    if (typeof name !== 'string') {
      return handleAppError(400, '匿稱格式錯誤', next);
    }
    if (!validator.isLength(name, { min: 2 })) {
      return handleAppError(400, '暱稱至少 2 個字元以上', next);
    }
    const updateProfile = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        gender,
        photo,
      },
      {
        new: true,
      },
    );
    handleResponse(res, 201, '個人資料更新成功', updateProfile);
  },
  // 取得個人按讚的貼文
  async getLikedPosts(req, res, next) {
    const postsList = await Like.find({
      user: req.user.id,
    })
      .populate({
        path: 'post',
        select: 'user content image tags createdAt',
        populate: {
          path: 'user',
          select: 'name photo',
        },
      })
      .sort({ createdAt: -1 });
    handleResponse(res, 200, '查詢成功', postsList);
  },
  // 刪除指定按讚的貼文
  async deleteLikedPost(req, res, next) {
    const targetPost = await Like.findByIdAndDelete(req.params.id);
    if (!targetPost) {
      return handleAppError(404, '查無此貼文 id', next);
    }
    handleResponse(res, 200, '刪除成功');
  },
  // 取得追蹤名單
  async getFollowingList(req, res, next) {
    const targetUser = await User.findById(req.user.id).populate({
      path: 'following.user',
      select: 'name photo createdAt',
    });
    if (!targetUser || !targetUser.following) {
      return handleAppError(404, '查無用戶追蹤名單', next);
    }
    // 直接回傳 following 陣列
    const followingList = targetUser.following.map((f) => f.user);
    handleResponse(res, 200, '查詢成功', followingList);
  },
  // 追蹤指定用戶
  async followUser(req, res, next) {
    if (req.user.id === req.params.id) {
      return handleAppError(400, '您無法追蹤自己', next);
    }
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return handleAppError(400, '查無此用戶 id', next);
    }
    // 將指定用戶加入當前用戶的追蹤列表
    const updateCurrentUser = User.updateOne(
      {
        _id: req.user.id,
        // 確保當前用戶 following 列表中不包含指定用戶
        'following.user': { $ne: req.params.id },
      },
      {
        $addToSet: { following: { user: req.params.id } },
      },
    );
    // 將當前用戶加入指定用戶的被追蹤列表
    const updateTargetUser = User.updateOne(
      {
        _id: req.params.id,
        // 確保指定用戶 followers 列表中不包含當前用戶
        'followers.user': { $ne: req.user.id },
      },
      {
        $addToSet: { followers: { user: req.user.id } },
      },
    );
    await Promise.all([updateCurrentUser, updateTargetUser]);
    handleResponse(res, 201, '追蹤成功');
  },
  // 取消追蹤指定用戶
  async unfollowUser(req, res, next) {
    if (req.user.id === req.params.id) {
      return handleAppError(400, '您無法取消追蹤自己', next);
    }
    // 將指定用戶移除當前用戶的追蹤列表
    await User.updateOne(
      {
        _id: req.user.id,
      },
      {
        $pull: { following: { user: req.params.id } },
      },
    );
    // 將當前用戶移除指定用戶的被追蹤列表
    await User.updateOne(
      {
        _id: req.params.id,
      },
      {
        $pull: { followers: { user: req.user.id } },
      },
    );
    handleResponse(res, 200, '已取消追蹤');
  },
};

module.exports = users;
