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
function create_mpg_sha_encrypt(dataChain) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HASH_KEY}&${dataChain}&HashIV=${HASH_IV}`;
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
    Amt: targetOrder.amt,
    ItemDesc: encodeURIComponent(targetOrder.itemDesc),
    OrderComment: encodeURIComponent('OrderComment'),
    TradeLimit: 900,
    ReturnURL: encodeURIComponent(RETURN_URL),
    NotifyURL: encodeURIComponent(NOTIFY_URL),
  };
  const dataChain = genDataChain(data);
  const mpg_aes_encrypt = create_mpg_aes_encrypt(dataChain);
  const mpg_sha_encrypt = create_mpg_sha_encrypt(dataChain);
  // 提交資料
  const tradeInfo = {
    MerchantID: MERCHANT_ID,
    TradeInfo: mpg_aes_encrypt,
    TradeSha: mpg_sha_encrypt,
    Version: VERSION,
  };
  return tradeInfo;
}

const payment = {
  async createPayment(req, res, next) {
    const { id } = req.body;
    const targetOrder = await Order.findById(id);
    if (!targetOrder) {
      return handleAppError(404, '查無此訂單 id', next);
    }
    // 執行加密函式，再回傳，需要更新 isPaid
    const tradeInfo = getTradeInfo(targetOrder);
    const url = `${PAYGATEWAY_CURL}`;
    try {
      const res = await axios.post(url, tradeInfo, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // 根据 API 文档设置合适的 Content-Type
        },
      });
      console.log('res', res);
    } catch (err) {
      console.error(
        'Payment request failed:',
        err.response ? err.response.data : err.message,
      );
    }
  },
};

module.exports = payment;
