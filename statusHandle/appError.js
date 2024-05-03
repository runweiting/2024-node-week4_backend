const appError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  // 自定屬性讓全域錯誤捕捉判斷是否為預期錯誤
  error.isOperational = true;
  return next(error);
};

module.exports = appError;
