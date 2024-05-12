const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/usersModel');
const {
  handleResponse,
  handleAppError,
} = require('../statusHandle/handleResponses');
const generateSendJWT = require('../tools/generateSendJWT');

const users = {
  async signUp(req, res, next) {
    let { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return next(handleAppError(400, '請填寫所有欄位'));
    }
    if (password !== confirmPassword) {
      return next(handleAppError(400, '密碼不一致'));
    }
    if (typeof name !== 'string') {
      return next(handleAppError(400, '資料格式錯誤'));
    }
    if (!validator.isLength(name, { min: 2 })) {
      return next(handleAppError(400, '暱稱至少 2 個字元以上'));
    }
    if (!validator.isEmail(email)) {
      return next(handleAppError(400, 'email格式錯誤'));
    }
    if (
      !validator.isLength(password, { min: 8 }) ||
      !validator.matches(password, '(?=.*[a-zA-Z])(?=.*\\d)')
    ) {
      return next(handleAppError(400, '密碼需至少 8 碼以上，並英數混合'));
    }
    // 加密密碼
    password = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password,
    });
    generateSendJWT(newUser, 201, '註冊成功', res);
  },
  async signIn(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(handleAppError(400, '帳號與密碼不可為空'));
    }
    if (!validator.isEmail(email)) {
      return next(handleAppError(400, 'email格式錯誤'));
    }
    if (
      !validator.isLength(password, { min: 8 }) ||
      !validator.matches(password, '(?=.*[a-zA-Z])(?=.*\\d)')
    ) {
      return next(handleAppError(400, '密碼需至少 8 碼以上，並中英混合'));
    }
    const targetUser = await User.findOne({ email }).select('+password');
    if (!targetUser) {
      return next(handleAppError(404, '無此使用者'));
    }
    const isAuth = await bcrypt.compare(password, targetUser.password);
    if (!isAuth) {
      return next(handleAppError(400, '密碼不正確'));
    }
    generateSendJWT(targetUser, 201, '註冊成功', res);
  },
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return next(handleAppError(400, '請填寫所有欄位'));
    }
    if (password !== confirmPassword) {
      return next(handleAppError(400, '密碼不一致'));
    }
    if (
      !validator.isLength(password, { min: 8 }) ||
      !validator.matches(password, '(?=.*[a-zA-Z])(?=.*\\d)')
    ) {
      return next(handleAppError(400, '密碼需至少 8 碼以上，並中英混合'));
    }
    const newPassword = await bcrypt.hash(password, 12);
    const targetUser = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });
    generateSendJWT(targetUser, 200, '密碼更新成功', res);
  },
  async getProfile(req, res, next) {
    const user = await User.findById(req.user.id);
    handleResponse(res, 200, '查詢成功', user);
  },
  async updateProfile(req, res, next) {
    const { name, gender, photo } = req.body;
    if (!name) {
      return next(handleAppError(400, '匿稱為必填'));
    }
    if (typeof name !== 'string') {
      return next(handleAppError(400, '匿稱格式錯誤'));
    }
    if (!validator.isLength(name, { min: 2 })) {
      return next(handleAppError(400, '暱稱至少 2 個字元以上'));
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
};

module.exports = users;
