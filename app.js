const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
console.log(process.env.JWT_EXPIRES_DAY, process.env.JWT_SECRET);

const {
  handleDevError,
  handleProError,
} = require('./statusHandle/handleResponses');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const notFound = require('./routes/notFound');

const app = express();
require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// * uncaughtException
// 當發生未捕獲的異常時，捕捉整個程式中的錯誤並終止執行
process.on('uncaughtException', (err) => {
  console.error('uncaughtException!');
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
});

//  * router middleware
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use(notFound);

// * 全域 錯誤捕捉
// 捕獲所有未被其他中間件或路由處理的錯誤
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return handleDevError(err, res);
  }
  // 過濾是否為各種 npm 錯誤訊息 = 翻譯 npm 錯誤給使用者看
  if (err.name === 'AxiosError') {
    err.isOperational = true;
    err.message = 'axios 連線錯誤';
    return handleProError(err, res);
  } else if (err.name === 'ValidationError') {
    err.isOperational = true;
    err.message = '資料欄位未正確填寫，請重新輸入！';
    return handleProError(err, res);
  } else if (err.name === 'CastError') {
    err.isOperational = true;
    err.message = '參數錯誤';
    return handleProError(err, res);
  }
  // 都不是，判斷是否為自定錯誤，不然就是 500
  return handleProError(err, res);
});

// * unhandledRejection
// catch 未被處理時觸發，捕獲異步操作中的錯誤
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的rejection：', promise, '原因：', err);
});

module.exports = app;
