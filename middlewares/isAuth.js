const jwt = require('jsonwebtoken');
const { handleAppError, handleErrorAsync } = require('./handleResponses');
const User = require('../models/usersModel');

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;
  // 確認 authorization header 是否存在
  if (!req.headers.authorization) {
    return handleAppError(400, 'authorization header 缺失', next);
  }
  // 確認 token 是否符合 Bearer 格式
  if (!req.headers.authorization.startsWith('Bearer ')) {
    return handleAppError(400, 'token 格式錯誤', next);
  }
  token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return handleAppError(401, '使用者尚未登入', next);
  }
  // 再解析 token 夾帶的 payload 是否正確
  let decoded;
  try {
    decoded = await new Promise((resolve, reject) => {
      // jwt.verify 使用 callbackFn (err, payload) 進行非同步操作
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            reject(handleAppError(401, 'token 已過期，請重新登入', next));
          } else if (err.name === 'JsonWebTokenError') {
            reject(handleAppError(403, '無效的 token，請重新登入', next));
          } else {
            reject(handleAppError(500, '驗證 token 時發生錯誤', next));
          }
        } else {
          resolve(payload);
        }
      });
    });
  } catch (err) {
    // handleAppError 已處理錯誤，因此直接返回
    return;
  }
  req.user = await User.findById(decoded.id);
  if (!req.user) {
    return handleAppError(401, '使用者不存在', next);
  }
  next();
});

module.exports = isAuth;
