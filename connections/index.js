const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
console.log(process.env.JWT_EXPIRES_DAY, process.env.JWT_SECRET);
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then((res) => console.log('資料庫連線成功'));
