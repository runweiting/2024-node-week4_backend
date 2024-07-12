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
  RETURN_URL,
  NOTIFY_URL,
  PAYGATEWAY_CURL,
  CLIENTBACK_URL,
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
  console.log(newOrder);
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
    MerchantID: MERCHANT_ID,
    TradeInfo: aesEncrypt,
    TradeSha: shaEncrypt,
    Version: VERSION,
    PayGateWay: PAYGATEWAY_CURL,
  };
  handleResponse(res, 200, '查詢成功', tradeInfo);
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
    LoginType: 0,
    OrderComment: 'OrderComment',
    Amt: order.amt,
    ItemDesc: encodeURIComponent(order.itemDesc),
    Email: encodeURIComponent(order.orderEmail),
    ReturnURL: encodeURIComponent(RETURN_URL),
    NotifyURL: encodeURIComponent(NOTIFY_URL),
    ClientBackURL: encodeURIComponent(CLIENTBACK_URL),
    TradeLimit: 900,
  };
  const dataChain = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  console.log('dataChain', dataChain);
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
