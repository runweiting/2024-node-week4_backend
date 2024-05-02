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

// * uncaughtException 的錯誤捕捉
// process.on('uncaughtException', ...) 是事件監聽器，當 'uncaughtException' 發生時就會觸發，表示程式中出現了未預期的錯誤，如果沒有被處理，程式可能會出現不可預測的行為，甚至中斷
// 捕獲到 'uncaughtException' 後，console.error() 將錯誤記錄下來
// process.exit(1) 是一個終止程式執行的方法，參數 1 表示有異常發生
// 這段程式碼的意思：當程式捕獲到未捕獲的異常後，先將錯誤記錄下來，然後立即終止程式的執行，以防止進一步的故障發生
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
// * 全域的錯誤捕捉
// 這個特定的 middleware 函式，在 Express 應用程序中捕捉並處理所有路由處理器中產生的錯誤，並向客戶端發送統一的錯誤回應，以確保用戶得到適當的提示，同時讓開發人員追蹤和除錯錯誤
// app.use(...) 將這個 middleware 函式添加到 Express 應用程序中的 middleware 隊列中，使其能夠處理每個請求
// (err, req, res, next) => { ... }：這是 middleware 函式的定義，接收四個參數，分別是錯誤對象（err）、請求對象（req）、響應對象（res）、以及下一個 middleware 函式（next）。這裡的 err 參數用於接收從其他 middleware 函式或路由處理器傳遞過來的錯誤信息
// console.error() 記錄錯誤名稱和堆棧跟蹤（stack trace）
// res.status(500).send(...) 設置響應狀態碼為 500（內部伺服器錯誤），並向客戶端發送一條簡單的錯誤消息，提示用戶程式出現問題，請稍後重試
app.use((err, req, res, next) => {
  console.error(err.name);
  console.error(err.stack);
  res.status(500).send('全域錯誤捕捉：程式有些問題，請稍後嘗試');
});
// * unhandledRejection 的錯誤捕捉
// 這段程式碼是設置一個事件監聽器，監聽未被處理的 Promise rejection。當使用 Promise 進行異步操作時，如果這個 Promise 被拒絕（rejected），但在異常發生後未進行相應的錯誤處理，這個 rejection 就被稱為「未捕獲的 rejection」。
// process.on('unhandledRejection', ...) 是事件監聽器，監聽未被處理的 Promise rejection，當一個 Promise 被拒絕，但沒有被 .catch() 或 Promise.reject() 捕獲時就會觸發
// (reason, promise) => { ... } 是執行的處理函式，接收兩個參數，reason 是 rejection 的原因，通常是一個錯誤對象或錯誤信息，promise 是被拒絕的 Promise 物件
// 在處理函式中，程式使用 console.error() 將未捕獲的 rejection 的相關信息 console.error() 記錄到日誌 log 上，以便後續分析和追蹤問題
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的rejection：', promise, '原因：', err);
});

module.exports = app;
