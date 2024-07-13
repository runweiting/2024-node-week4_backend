const allowedOrigins = require('../configs/allowedOrigins');

// 處理需身份驗證或會話管理的跨域 API 請求
const credentials = (req, res, next) => {
  // 取得網域
  const origin = req.headers.origin;
  // 網域是否符合白名單
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};

module.exports = credentials;
