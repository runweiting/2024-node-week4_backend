// 設置白名單
const whitelist = [
  'https://two024-node-week4.onrender.com',
  'http://localhost:3010',
];
// 瀏覽器發出跨領域請求時，Request headers 中會包含一個 origin 來表示該請求的來源網域，伺服器透過檢查 origin 來判斷是否允許該跨域請求。某些請求不是由瀏覽器發起，就可能不會包含 origin，如 Postman、Swagger 或直接從伺服器發出的請求
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      const error = new Error('Not allowed by CORS');
      // Forbidden
      error.statusCode = 403;
      error.isOperational = true;
      callback(error);
    }
  },
};
