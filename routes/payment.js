const express = require('express');
const router = express.Router();
const { handleErrorAsync } = require('../middlewares/handleResponses');
const isAuth = require('../middlewares/isAuth');
const PaymentController = require('../controllers/paymentController');

// 用戶點擊確認付款，發出藍新請求
router.post('/', isAuth, handleErrorAsync(PaymentController.createPayment));

module.exports = router;
