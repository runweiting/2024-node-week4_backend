// function handleSuccess(res, message, post = null) {
//   const data = {
//     status: "success",
//     message: message,
//   };
//   if (post) {
//     data.post = post;
//   }
//   res.writeHead(200);
//   res.write(JSON.stringify(data));
//   res.end();
// }
// function handleError(res, message, statusCode = 400) {
//   const data = {
//     status: "failed",
//     message: message,
//   };
//   res.writeHead(statusCode);
//   res.write(JSON.stringify(data));
//   res.end();
// }

// module.exports = { handleSuccess, handleError };

const appError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  // 自定屬性讓全域錯誤捕捉判斷是否為預期錯誤
  error.isOperational = true;
  return error;
};

module.exports = appError;
