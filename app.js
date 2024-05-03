var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

var app = express();
require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 還沒有寫登入驗證的 middleware

// * uncaughtException 錯誤捕捉
// process.on('uncaughtException', ...) 監聽預期外的錯誤，須處理以防程式出現不可預測的行為，console.error() 記錄錯誤，process.exit(1) 終止程式執行
process.on('uncaughtException', (err) => {
  console.error('uncaughtException!');
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
// * 404 錯誤捕捉
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: '無此頁面資訊',
  });
});

// * 全域 錯誤捕捉
// 處理所有路由中產生的錯誤訊息，err 接收其他 middleware 傳來的錯誤信息，console.error() 記錄錯誤，500 為程式錯誤

// * 開發、正式環境 錯誤管理
// err.stack 會提供錯誤發生的堆疊資訊，此資訊會暴露專案結構，若顯示在前端有潛在風險，因此須區隔：開發環境回傳的錯誤訊息、正式環境回傳的錯誤訊息，以提升整體安全性
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
//
const resErrorPro = (err, res) => {
  // 是否為預期錯誤
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    // log 記錄
    console.error('出現重大錯誤：', err);
    // 送出預設訊息
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請洽系統管理員',
    });
  }
};
app.use((err, req, res, next) => {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV == 'dev') {
    return resErrorDev(err, res);
  }
  // pro 處理 mongoose Schema 欄位驗證錯誤
  if (err.name == 'ValidationError') {
    err.message = '資料欄位未正確填寫，請重新輸入！';
    err.isOperational = true;
    return resErrorPro(err, res);
  }
  return resErrorPro(err, res);
});
// * unhandledRejection 錯誤捕捉
// process.on('unhandledRejection', ...) 監聽未被處理的 Promise rejection，err 是錯誤對象或信息，promise 是被拒絕的 Promise 物件，console.error() 記錄錯誤到 log 上，以便後續分析和追蹤問題
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的rejection：', promise, '原因：', err);
});

module.exports = app;
