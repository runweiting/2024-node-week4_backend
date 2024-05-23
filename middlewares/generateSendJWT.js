const jwt = require('jsonwebtoken');

const generateSendJWT = (user, statusCode, message, res) => {
  const { _id, name, photo } = user;
  // 將 user _id, name, photo 作為 payload 生成 token
  const token = jwt.sign({ id: _id, name, photo }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  // 將 token 到期日一併回傳，讓前台夾帶在 document.cookie
  const expired =
    Date.now() + parseInt(process.env.JWT_EXPIRES_DAY) * 24 * 60 * 60 * 1000;
  res.status(statusCode).json({
    status: true,
    message,
    token,
    expired,
  });
};

module.exports = generateSendJWT;