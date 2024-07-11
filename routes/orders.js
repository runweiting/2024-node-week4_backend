const express = require('express');
const router = express.Router();
const { handleErrorAsync } = require('../middlewares/handleResponses');
const isAuth = require('../middlewares/isAuth');
const OrdersController = require('../controllers/ordersController');

// 用戶點擊預購商品，DB 建立訂單
router.post('/', isAuth, handleErrorAsync(OrdersController.createOrder));

// 用戶來到訂單頁面，res 回傳加密訂單詳情，用戶填寫付款方式
// router.get('/:orderId', isAuth, handleErrorAsync(OrdersController.getOrder));

module.exports = router;
