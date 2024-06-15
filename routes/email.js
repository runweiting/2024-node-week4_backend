const express = require('express');
const router = express.Router();
const {
  handleResponse,
  handleAppError,
  handleErrorAsync,
} = require('../middlewares/handleResponses');
const isAuth = require('../middlewares/isAuth');
const validator = require('validator');
const nodemailer = require('nodemailer');
const google = require('googleapis');
// 建立 OAuth2Client 實體
const OAuth2 = google.auth.OAuth2;

router.post(
  '/sign-up',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { to, title, content } = req.body;
    if (!validator.isEmail(to)) {
      return handleAppError(400, 'email格式錯誤', next);
    }
    if (!title.trim() || !content.trim()) {
      return handleAppError(400, '標題和內容為必填', next);
    }
    // 建立 OAuth2Client 資料
    const OAuth2Client = new OAuth2(
      process.env.GOOGLE_GMAIL_CLIENT_ID,
      process.env.GOOGLE_GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground',
    );
    // 建立憑證
    OAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_GMAIL_REFRESH_TOKEN,
    });
    const accessToken = OAuth2Client.getAccessToken();
    // 建立 smth 認證資料
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.NODEMAILER_TRANSPORT_USER,
        clientId: process.env.GOOGLE_GMAIL_CLIENT_ID,
        clientSecret: process.env.GOOGLE_GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_GMAIL_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: process.env.NODEMAILER_TRANSPORT_USER,
      to,
      title,
      content,
    };
    await transport.sendMail(mailOptions);
    handleResponse(res, 200, '信件發送成功');
  }),
  /**
   * #swagger.ignore = true
   */
);

module.exports = router;
