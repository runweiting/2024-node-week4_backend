const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD,
// );
mongoose
  .connect('mongodb://localhost:27017')
  .then((res) => console.log('資料庫連線成功'));
