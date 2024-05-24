const jwt = require('jsonwebtoken');

const generateSendJWT = (user, statusCode, message, res) => {
  const { _id, name, photo } = user;
  // 將 user _id, name, photo 作為 payload 生成 token
  const token = jwt.sign({ id: _id, name, photo }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  // 將 token 到期日一併回傳，讓前台夾帶在 document.cookie
  // 新增 Date(當前時間戳 + 天數 * 24 * 60 * 60 * 1000(毫秒)).轉換為 UTC 格式字串
  const expires = new Date(
    Date.now() + parseInt(process.env.JWT_EXPIRES_DAY) * 24 * 60 * 60 * 1000,
  ).toUTCString();
  res.status(statusCode).json({
    status: true,
    message,
    token,
    expires,
  });
};

const generateUrlJWT = (user, res) => {
  // 將 user _id 作為 payload 生成 token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  // 將 token 到期日一併回傳，讓前台夾帶在 document.cookie
  // 新增 Date(當前時間戳 + 天數 * 24 * 60 * 60 * 1000(毫秒)).轉換為 UTC 格式字串
  const expires = new Date(
    Date.now() + parseInt(process.env.JWT_EXPIRES_DAY) * 24 * 60 * 60 * 1000,
  ).toUTCString();
  // 使用者透過 ‘/user/google’ 登入 google，不是透過 API，故需重新導向 res.redirect
  res.redirect(
    `${process.env.GOOGLE_RESOURCE_OWNER_REDIRECT}?token=${token}&expires=${expires}`,
  );
};

module.exports = {
  generateSendJWT,
  generateUrlJWT,
};
