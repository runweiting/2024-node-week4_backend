const express = require('express');
const router = express.Router();
const {
  handleResponse,
  handleAppError,
  handleErrorAsync,
} = require('../middlewares/handleResponses');
const isAuth = require('../middlewares/isAuth');
const validator = require('validator');
const { sendEmail } = require('../middlewares/sendEmail');
const User = require('../models/usersModel');
const users = require('../controllers/usersController');

// 驗證註冊信箱
router.get(
  '/verify-email',
  isAuth,
  handleAppError(async (req, res, next) => {
    const { verificationToken } = req.body;
    if (!verificationToken) {
      return handleAppError(400, '無效的驗證請求', next);
    }
    const targetUser = User.findOne({ verificationToken });
    if (!targetUser) {
      return handleAppError(400, '驗證碼無效或已過期', next);
    }
    if (targetUser.verificationToken !== verificationToken) {
      return handleAppError(400, '驗證碼無效', next);
    }
    if (targetUser.verificationTokenExpires < Date.now()) {
      return handleAppError(400, '驗證碼已過期', next);
    }
    targetUser.verificationToken = undefined;
    targetUser.verificationTokenExpires = undefined;
    await targetUser.save();
    handleResponse(200, '註冊信箱驗證成功');
  }),
);

// 自定回覆郵件（需由前端輸入郵件內容）
router.post(
  '/personalEmail',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { to, subject, text } = req.body;
    if (!validator.isEmail(to)) {
      return handleAppError(400, 'email格式錯誤', next);
    }
    if (!subject.trim() || !text.trim()) {
      return handleAppError(400, '標題及內容為必填', next);
    }
    const result = await sendEmail(to, subject, text, null);
    if (!result.status) {
      return handleAppError(500, '郵件發送失敗', next);
    }
    handleResponse(res, 200, '郵件發送成功');
  }),
  /**
   * #swagger.ignore = true
   */
);

module.exports = router;
