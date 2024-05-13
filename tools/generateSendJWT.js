const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '/config.env' });
console.log(
  'generateSendJWT:',
  process.env.JWT_EXPIRES_DAY,
  process.env.JWT_SECRET,
);

const generateSendJWT = (user, statusCode, message, res) => {
  // 將 user.id 作為 payload 生成 token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  // 將 token 到期日一併回傳，讓前台夾帶在 document.cookie
  const expired =
    Date.now() + parseInt(process.env.JWT_EXPIRES_DAY) * 24 * 60 * 60 * 1000;
  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    expired,
  });
};

module.exports = generateSendJWT;
