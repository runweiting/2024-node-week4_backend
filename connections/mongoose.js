const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_ATLAS_URL)
  .then((res) => console.log('資料庫連線成功'))
  .catch((err) => console.log('資料庫連接有誤', err.message));
