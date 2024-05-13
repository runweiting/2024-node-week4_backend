const mongoose = require('mongoose');
const DB = process.env.MONGODB_ATLAS_URL.replace(
  '<password>',
  process.env.MONGODB_ATLAS_PASSWORD,
);
mongoose
  .connect(DB)
  .then((res) => console.log('資料庫連線成功'))
  .catch((err) => console.log('資料庫連接有誤', err.message));
