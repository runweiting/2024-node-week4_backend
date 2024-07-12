const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./configs/corsOptions');
const credentials = require('./middlewares/credentials');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const session = require('express-session');
// 將 session 數據保存到 MongoDB 數據庫中，如此可在分佈式環境中共享 session，並且在伺服器重啟或崩潰後仍能保留用戶的 session 資料
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: './config.env' });

const {
  handleGlobalError,
  handleUncaughtException,
  handleUnhandledRejection,
} = require('./middlewares/handleResponses');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const uploadRouter = require('./routes/upload');
const authRouter = require('./routes/auth');
const emailRouter = require('./routes/email');
const ordersRouter = require('./routes/orders');
const notFound = require('./routes/notFound');

const app = express();
require('./connections/mongoose');
require('./connections/passport');

handleUncaughtException();
handleUnhandledRejection();

// 設置 EJS 作為視圖引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(helmet());
app.use(credentials);
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      // 指定 MongoDB URI
      mongoUrl: process.env.MONGODB_ATLAS_URL,
      // 存儲集合的名稱
      collectionName: 'sessions',
    }),
    // 正式環境 secure: true，測試環境 secure: false
    cookie: {
      secure: process.env.NODE_ENV === 'pro',
    },
  }),
);

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter);
app.use(
  '/api-doc',
  swaggerUI.serve,
  swaggerUI.setup(swaggerFile, {
    swaggerOptions: {
      // 設置回應攔截器，只保留回應 headers 的 content-type
      responseInterceptor: (response) => {
        response.headers = { 'content-type': response.headers['content-type'] };
        return response;
      },
    },
  }),
);
app.use('/auth', authRouter);
app.use('/email', emailRouter);
app.use('/orders', ordersRouter);
app.use(notFound);

// Global Error Handling
app.use(handleGlobalError);

module.exports = app;
