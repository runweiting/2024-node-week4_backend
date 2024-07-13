const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/ordersModel');
const User = require('../models/usersModel');
const {
  handleErrorAsync,
  handleResponse,
  handleAppError,
} = require('../middlewares/handleResponses');
const isAuth = require('../middlewares/isAuth');
const {
  MERCHANT_ID,
  HASH_KEY,
  HASH_IV,
  VERSION,
  RESPOND_TYPE,
  PAYGATEWAY_CURL,
} = process.env;

// 建立訂單
router.post('/', isAuth, async (req, res, next) => {
  const { userId, email, amt, itemDesc } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return handleAppError(404, '用戶不存在', next);
  }
  const newOrder = await Order.create({
    user: userId,
    orderEmail: email,
    amt,
    itemDesc,
  });
  handleResponse(res, 201, '新增成功', newOrder._id.toString());
});

// 取得訂單
router.get('/:id', isAuth, async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    return handleAppError(404, '訂單不存在', next);
  }
  // 加密
  const aesEncrypt = create_mpg_aes_encrypt(order);
  const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt);
  // 回傳加密
  const tradeInfo = {
    MerchantID: MERCHANT_ID.toString(),
    TradeInfo: aesEncrypt,
    TradeSha: shaEncrypt,
    Version: VERSION,
    PayGateWay: PAYGATEWAY_CURL,
  };
  handleResponse(res, 200, '查詢成功', tradeInfo);
});

// newebpay_return
router.post('/newebpay_return', async (req, res, next) => {
  // 更新訂單狀態等
  const data = req.body;
  console.log('return', data);
  res.json(req.body);
  res.redirect(
    'https://runweiting.github.io/2024-node-week4_frontend/#/dashboard/payment-result',
  );
});

// newebpay_notify
router.post('/newebpay_notify', async (req, res, next) => {
  const data = req.body;
  console.log('notify', data);
  res.end();
});

// 1. 生成請求字串：排列參數並串聯
function genDataChain(order) {
  // 基本資料
  const data = {
    MerchantID: MERCHANT_ID,
    RespondType: RESPOND_TYPE,
    TimeStamp: order.timestamp,
    Version: VERSION,
    MerchantOrderNo: order.merchantOrderNo,
    Amt: order.amt,
    ItemDesc: encodeURIComponent(order.itemDesc),
    // NotifyURL: encodeURIComponent(NOTIFY_URL),
    // ReturnURL: encodeURIComponent(RETURN_URL),
    // ClientBackURL: encodeURIComponent(CLIENTBACK_URL),
    Email: encodeURIComponent(order.orderEmail),
    // LoginType: 0,
    // TradeLimit: 900,
    // OrderComment: 'OrderComment',
  };
  const dataChain = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return dataChain;
}
// 2. 將請求字串加密：AES-256-CBC 加密訂單資料
function create_mpg_aes_encrypt(order) {
  const encrypt = crypto.createCipheriv('aes-256-cbc', HASH_KEY, HASH_IV);
  const enc = encrypt.update(genDataChain(order), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}
// 3. 將 AES 加密字串產生檢查碼：SHA-256 加密驗證資料
function create_mpg_sha_encrypt(aesEncrypt) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HASH_KEY}&${aesEncrypt}&HashIV=${HASH_IV}`;
  return sha.update(plainText).digest('hex').toUpperCase();
}

module.exports = router;
