const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/ordersController');
const { handleErrorAsync } = require('../middlewares/handleResponses');
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
    // 生成 token, expires 並導向回 UserCallback
    genNewebpayReturnUrlJWT(req.targetOrder.user, res);
  }),
);

// newebpay_notify
router.post(
  '/newebpay_notify',
  checkOrderExists,
  handleErrorAsync(OrdersController.newebpayNotify),
);

module.exports = router;
