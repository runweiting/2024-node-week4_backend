// 回傳成功
const handleResponse = (res, httpStatus, message, data) => {
  res.status(httpStatus).json({
    status: 'success',
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
    status: 'error',
    message: message,
  };
  if (err) {
    send.error = err;
    send.errorName = errName;
    send.errorStack = errStack;
  }
  res.status(httpStatus).json(send);
};

// 回傳自定錯誤
const handleAppError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  return error;
};

// 回傳非同步錯誤
const handleErrorAsync = function handleErrorAsync(func) {
  // 新增 middleware 接住資料
  return function (req, res, next) {
    // 執行 func 並加上 catch 統一捕捉錯誤
    func(req, res, next).catch((err) => {
      return next(err);
    });
  };
};

// 回傳 dev 開發環境錯誤
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

// 回傳 pro 正式環境錯誤
const handleProError = (err, res) => {
  if (err.isOperational) {
    handleErrorResponse(res, err.statusCode, err.message);
  } else {
    console.error('出現重大錯誤：', err);
    handleErrorResponse(res, 500, '系統錯誤，請洽系統管理員');
  }
};

module.exports = {
  handleResponse,
  handleErrorResponse,
  handleAppError,
  handleErrorAsync,
  handleDevError,
  handleProError,
};
