function handleSuccess(res, message, post = null) {
  const data = {
    status: "success",
    message: message,
  };
  if (post) {
    data.post = post;
  }
  res.writeHead(200);
  res.write(JSON.stringify(data));
  res.end();
}
function handleError(res, message, statusCode = 400) {
  const data = {
    status: "failed",
    message: message,
  };
  res.writeHead(statusCode);
  res.write(JSON.stringify(data));
  res.end();
}

module.exports = { handleSuccess, handleError };
