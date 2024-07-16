const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/ordersController');
const {
  handleErrorAsync,
  handleAppError,
} = require('../middlewares/handleResponses');
const isAuth = require('../middlewares/isAuth');
const { genNewebpayReturnUrlJWT } = require('../middlewares/generateJWT');
const checkOrderExists = require('../middlewares/checkOrderExists');

// 建立訂單
router.post('/', isAuth, handleErrorAsync(OrdersController.createOrder));

// 取得訂單
router.get('/:id', isAuth, handleErrorAsync(OrdersController.getOrder));

// newebpay_return
router.post(
  '/newebpay_return',
  checkOrderExists,
  handleErrorAsync(async (req, res, next) => {
    console.log('return 收到付款通知');
    if (req.order.isPaid) {
      // 帶入 isPaid = true 的 targetOrder 生成 token, expires 導向回 UserCallback
      genNewebpayReturnUrlJWT(req.order, res, next);
    } else {
      return handleAppError(400, '訂單尚未付款', next);
    }
  }),
);

// newebpay_notify
router.post(
  '/newebpay_notify',
  checkOrderExists,
  handleErrorAsync(OrdersController.newebpayNotify),
);

module.exports = router;
