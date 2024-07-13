// 正確的 CORS 設置只應用前端和後端的來源
const allowedOrigins = [
  'https://two024-node-week4.onrender.com',
  'http://two024-node-week4.onrender.com',
  'http://localhost:3010',
  'https://runweiting.github.io',
  'http://localhost:5173',
  'https://ccore.newebpay.com',
];

module.exports = allowedOrigins;
