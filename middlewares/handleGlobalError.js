const {
  handleDevError,
  handleProError,
} = require('../middlewares/handleResponses');

module.exports = (err, req, res, next) => {
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
