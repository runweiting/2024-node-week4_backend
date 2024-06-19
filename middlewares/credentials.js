const allowedOrigins = require('../configs/allowedOrigins');

// 處理需身份驗證或會話管理的跨域 API 請求
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};

module.exports = credentials;
