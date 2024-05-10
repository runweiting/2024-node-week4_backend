const jwt = require('jsonwebtoken');

const generateSendJWT = (user, statusCode, message, res) => {
  // 將 user.id 作為 payload 生成 token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    message: message,
    user: {
      name: user.name,
      token,
    },
  });
};

module.exports = generateSendJWT;
