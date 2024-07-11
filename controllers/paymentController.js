const crypto = require('crypto');
const axios = require('axios');
const {
  handleResponse,
  handleAppError,
} = require('../middlewares/handleResponses');
const Order = require('../models/ordersModel');
const User = require('../models/usersModel');
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

// 排列參數並串聯
function genDataChain(data) {
  return Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}
// AES-256-CBC 加密訂單資料
function create_mpg_aes_encrypt(dataChain) {
  const encrypt = crypto.createCipheriv('aes-256-cbc', HASH_KEY, HASH_IV);
  const enc = encrypt.update(genDataChain(dataChain), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}
// SHA-256 加密驗證資料
function create_mpg_sha_encrypt(aesEncrypt) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HASH_KEY}&${aesEncrypt}&HashIV=${HASH_IV}`;
  return sha.update(plainText).digest('hex').toUpperCase();
}
// 提交藍新訂單
function getTradeInfo(targetOrder) {
  // 基本資料
  const data = {
    MerchantID: MERCHANT_ID,
    RespondType: RESPOND_TYPE,
    TimeStamp: targetOrder.timestamp,
    Version: VERSION,
    MerchantOrderNo: targetOrder.merchantOrderNo,
    LoginType: 0,
    OrderComment: 'OrderComment',
    Amt: targetOrder.amt,
    ItemDesc: encodeURIComponent(targetOrder.itemDesc),
    Email: encodeURIComponent(targetOrder.user.email),
    ReturnURL: encodeURIComponent(RETURN_URL),
    NotifyURL: encodeURIComponent(NOTIFY_URL),
    ClientBackURL: encodeURIComponent(CLIENTBACK_URL),
    TradeLimit: 900,
  };
  const dataChain = genDataChain(data);
  const aesEncrypt = create_mpg_aes_encrypt(dataChain);
  const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt);
  // 提交資料
  const tradeInfo = {
    MerchantID: MERCHANT_ID,
    TradeInfo: aesEncrypt,
    TradeSha: shaEncrypt,
    Version: VERSION,
  };
  console.log('data', data);
  console.log('dataChain', dataChain);
  console.log('aesEncrypt', aesEncrypt);
  console.log('shaEncrypt', shaEncrypt);
  console.log('tradeInfo', tradeInfo);
  return tradeInfo;
}

const payment = {
  async createPayment(req, res, next) {
    const { id } = req.body;
    const targetOrder = await Order.findById(id).populate({
      path: 'user',
      select: 'email',
    });
    console.log('targetOrder', targetOrder);
    if (!targetOrder) {
      return handleAppError(404, '查無此訂單 id', next);
    }
    const tradeInfo = getTradeInfo(targetOrder);
    res.render('payment', {
      title: 'NewebPay Payment',
      PayGateWay: PAYGATEWAY_CURL,
      NotifyUrl: NOTIFY_URL,
      ReturnUrl: RETURN_URL,
      targetOrder,
      tradeInfo,
    });

    // 執行加密函式，再回傳，需要更新 isPaid
    // try {
    //   const url = `${PAYGATEWAY_CURL}`;
    //   const res = await axios.post(url, tradeInfo);
    //   console.log('res', res);
    //   await Order.findByIdAndUpdate(id, {
    //     isPaid: true,
    //   });
    // } catch (err) {
    //   console.error('err.message ', err.message);
    // }
  },
};

module.exports = payment;
