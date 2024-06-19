const express = require('express');
const router = express.Router();
const oauth2Client = require('../configs/googleOAuth2Client');

// 定義授權範圍
const SCOPES = ['https://mail.google.com/'];
// 指定管理員從前端進入 '/auth/login' 並重定向到同意畫面
router.get(
  '/login',
  (req, res) => {
    // 生成 Google 授權 URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    res.redirect(authUrl);
  },
  /**
   * #swagger.ignore = true
   */
);
// 完成授權進入 callback
router.get(
  '/google/callback',
  async (req, res, next) => {
    // 從 query 中提取授權碼
    const code = req.query.code;
    try {
      // 用授權碼換取 access token, refresh token
      const { tokens } = await oauth2Client.getToken(code);
      // 設置憑證
      oauth2Client.setCredentials(tokens);
      // 將 tokens 存儲在使用者 session
      // 使用 express-session 啟用 session 功能
      req.session.tokens = tokens;
      // 重定向到撰寫郵件頁面
      res.redirect('/email/user');
    } catch (err) {
      next(err);
    }
  },
  /**
   * #swagger.ignore = true
   */
);

module.exports = router;
