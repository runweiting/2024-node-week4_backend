const mongoose = require('mongoose');
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB)
  .then((res) => console.log('資料庫連線成功'))
  .catch((err) => console.err(err));
