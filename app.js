const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
require('dotenv').config({ path: './config.env' });

const { handleGlobalError } = require('./middlewares/handleResponses');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const uploadRouter = require('./routes/upload');
const notFound = require('./routes/notFound');

const app = express();
require('./connections/mongoose');

// * Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// * Uncaught Exception
// 當發生未捕獲的異常時，捕捉整個程式中的錯誤並終止執行
process.on('uncaughtException', (err) => {
  console.error('uncaughtException!');
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
});

//  * Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter);
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(notFound);

// * Global Error Handling
// 捕獲所有未被其他中間件或路由處理的錯誤
app.use(handleGlobalError);

// * Unhandled Rejection
// catch 未被處理時觸發，捕獲異步操作中的錯誤
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的rejection：', promise, '原因：', err);
});

module.exports = app;
