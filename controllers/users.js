const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/usersModel');
const appError = require('../statusHandle/appError');
const generateSendJWT = require('../tools/generateSendJWT');

const users = {
  async signUp(req, res, next) {
    let { name, email, password } = req.body;
    if (typeof name !== 'string') {
      return next(appError(400, '資料格式錯誤'));
    }
    if (!validator.isLength(name, { min: 2 })) {
      return next(appError(400, '暱稱至少 2 個字元以上'));
    }
    if (!validator.isEmail(email)) {
      return next(appError(400, 'email格式錯誤'));
    }
    if (
      !validator.isLength(password, { min: 8 }) ||
      !validator.matches(password, '(?=.*[a-zA-Z])(?=.*\\d)')
    ) {
      return next(appError(400, '密碼需至少 8 碼以上，並中英混合'));
    }
    // 加密密碼
    password = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password,
    });
    generateSendJWT(newUser, 200, res);
  },
  async signIn(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appError(400, '帳號與密碼不可為空'));
    }
    if (!validator.isEmail(email)) {
      return next(appError(400, 'email格式錯誤'));
    }
    const targetUser = await User.findOne({ email }).select('+password');
    const isAuth = await bcrypt.compare(password, targetUser.password);
    if (!isAuth) {
      return next(appError(400, '您輸入的密碼不正確'));
    }
    generateSendJWT(targetUser, 200, res);
  },
};

module.exports = users;
