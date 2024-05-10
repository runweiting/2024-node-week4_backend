const jwt = require('jsonwebtoken');
const {
  handleAppError,
  handleErrorAsync,
} = require('../statusHandle/handleResponses');
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
    return next(handleAppError(401, '尚未登入'));
  }
  // 再解析 token 夾帶的 payload 是否正確
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  const targetUser = await User.findById(decoded.id);
  req.user = targetUser;
  next();
});

module.exports = isAuth;
