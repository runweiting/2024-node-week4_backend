const jwt = require('jsonwebtoken');
const { handleAppError, handleErrorAsync } = require('./handleResponses');
const User = require('../models/usersModel');

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;
  // 先確認 token 是否存在
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return handleAppError(401, '使用者尚未登入', next);
  }
  // 再解析 token 夾帶的 payload 是否正確
  const decoded = await new Promise((resolve, reject) => {
    // jwt.verify 使用 callbackFn (err, payload) 進行非同步操作
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  req.user = await User.findById(decoded.id);
  next();
});

module.exports = isAuth;
