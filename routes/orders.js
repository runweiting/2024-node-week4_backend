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

// 查詢訂單
router.get(
  '/status/:id',
  isAuth,
  handleErrorAsync(OrdersController.checkStatus),
);

// newebpay_notify
router.post(
  '/newebpay_notify',
  checkOrderExists,
  handleErrorAsync(OrdersController.newebpayNotify),
);

// newebpay_return
router.post(
  '/newebpay_return',
  checkOrderExists,
  handleErrorAsync(async (req, res, next) => {
    console.log('===== return =====');
    if (req.order.isPaid) {
      // 帶入 isPaid = true 的 targetOrder 生成 token, expires 導向回 UserCallback
      genNewebpayReturnUrlJWT(req.order, res, next);
    } else {
      console.log('return 訂單尚未付款');
    }
  }),
);

module.exports = router;
