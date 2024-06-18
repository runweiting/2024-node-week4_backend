const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const session = require('express-session');
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
const notFound = require('./routes/notFound');

const app = express();
require('./connections/mongoose');
require('./connections/passport');

handleUncaughtException();
handleUnhandledRejection();

// Middlewares
app.use(cors());
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
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use('/auth', authRouter);
app.use('/email', emailRouter);
app.use(notFound);
// Global Error Handling
app.use(handleGlobalError);

module.exports = app;
