const multer = require('multer');

// 回傳成功
const handleResponse = (res, httpStatus, message, data) => {
  res.status(httpStatus).json({
    status: true,
    message,
    data,
  });
};

// 回傳錯誤
const handleErrorResponse = (
  res,
  httpStatus,
  message,
  err,
  errName,
  errStack,
) => {
  const send = {
    status: false,
    message: message,
  };
  if (err) {
    send.error = err;
    send.errorName = errName;
    send.errorStack = errStack;
  }
  res.status(httpStatus).json(send);
};

// 自定錯誤
const handleAppError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  // 若有 next
  if (next) {
    // 跳過後續的路由和中間件，將 error 直接傳遞給全域錯誤捕捉
    return next(error);
  }
  // 自行處理 error，不用 next 傳遞 error 給下一個 middleware
  return error;
};

// 非同步錯誤
const handleErrorAsync = function handleErrorAsync(func) {
  // 新增 middleware 接住資料
  return function (req, res, next) {
    // 執行 func 並加上 catch 統一捕捉錯誤
    func(req, res, next).catch((err) => {
      return next(err);
    });
  };
};

// dev 開發環境錯誤
const handleDevError = (err, res) => {
  handleErrorResponse(
    res,
    err.statusCode,
    err.message,
    err,
    err.name,
    err.stack,
  );
};

// pro 正式環境錯誤
const handleProError = (err, res) => {
  if (err.isOperational) {
    handleErrorResponse(res, err.statusCode, err.message);
  } else {
    console.error('出現重大錯誤：', err);
    handleErrorResponse(res, 500, '系統錯誤，請洽系統管理員');
  }
};

// 全域錯誤捕捉
const handleGlobalError = (err, req, res, next) => {
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
};

// multer 錯誤
const handleMulterError = (err, req, res, next) => {
  // instanceof 檢查錯誤是否為特定類型，以便進行特定的錯誤處理
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return handleAppError(400, '檔案大小超過限制：僅限 2MB 以下。', next);
    }
  }
  next(err);
};

module.exports = {
  handleResponse,
  handleErrorResponse,
  handleAppError,
  handleErrorAsync,
  handleDevError,
  handleProError,
  handleGlobalError,
  handleMulterError,
};
