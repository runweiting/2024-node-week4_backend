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

// 出現預期外的錯誤捕捉
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

// 在所有路由之後，處理 404
app.use((req, res, next) => {
  res.status(404).send("Sorry, the page you're looking for doesn't exist.");
});
// 全域錯誤捕捉 500
app.use((err, req, res, next) => {
  console.error(err.name);
  console.error(err.stack);
  res.status(500).send('程式有些問題，請稍後嘗試');
});
// 未捕捉的 catch
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的rejection：', promise, '原因：', err);
});

module.exports = app;
