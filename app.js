const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

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
// 當程式接收到請求時，根據路由進入到相應的中間件或控制器
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// * 404 錯誤捕捉
// 如果請求未匹配到任何路由，將被認定是 404 錯誤
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: '無此頁面資訊',
  });
});

// * 全域 錯誤捕捉
// 捕獲所有未被其他中間件或路由處理的錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
    error: err,
    errorName: err.name,
    errorStack: err.stack,
  });
};
const resErrorPro = (err, res) => {
  // 是否為預期錯誤
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    console.error('出現重大錯誤：', err);
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請洽系統管理員',
    });
  }
};
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  // 判斷是否為 dev
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  // 為 pro，先過濾是否為 npm 的各種錯誤訊息 = 翻譯 npm 錯誤給使用者看
  if (err.name === 'AxiosError') {
    err.isOperational = true;
    err.message = 'axios 連線錯誤';
    return resErrorPro(err, res);
  } else if (err.name === 'ValidationError') {
    err.isOperational = true;
    err.message = '資料欄位未正確填寫，請重新輸入！';
    return resErrorPro(err, res);
  } else if (err.name === 'CastError') {
    err.isOperational = true;
    err.message = '參數錯誤';
    return resErrorPro(err, res);
  }
  // 都不是，再進入 resErrorPro 判斷是否為 isOperational，不然就是 500 重大錯誤
  return resErrorPro(err, res);
});

// * unhandledRejection
// 當 Promise 被拒絕，但沒有被 catch 處理時會觸發，捕獲異步操作中的錯誤
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的rejection：', promise, '原因：', err);
});

module.exports = app;
