const crypto = require('crypto');
const { handleAppError, handleErrorAsync } = require('./handleResponses');
const Order = require('../models/ordersModel');
const { NEWEBPAY_HASH_KEY, NEWEBPAY_HASH_IV } = process.env;

function create_mpg_aes_decrypt(tradeInfo) {
  try {
    const decrypt = crypto.createDecipheriv(
      'aes-256-cbc',
      NEWEBPAY_HASH_KEY,
      NEWEBPAY_HASH_IV,
    );
    // 關閉自動填充（padding）
    decrypt.setAutoPadding(false);
    const text = decrypt.update(tradeInfo, 'hex', 'utf8');
    const plainText = text + decrypt.final('utf8');
    const result = plainText.replace(/[\x00-\x20]+/g, '');
    return result;
  } catch (err) {
    console.log('解密過程中出現錯誤:', err);
  }
}

const decryptTradeInfo = (response) => {
  const decryptData = JSON.parse(create_mpg_aes_decrypt(response.TradeInfo));
  return decryptData;
};

// 共用中介軟體：檢查訂單是否存在
const checkOrderExists = handleErrorAsync(async (req, res, next) => {
  // 可能因測試機 response 沒有顯示 CheckCode (手冊有寫 p.23, p.50)
  const decryptData = decryptTradeInfo(req.body);
  const targetOrder = await Order.findOne({
    merchantOrderNo: decryptData.Result.MerchantOrderNo,
  }).populate({
    path: 'user',
    select: '_id',
  });
  if (!targetOrder) {
    return handleAppError(404, '此筆訂單不存在', next);
  }
  req.targetOrder = targetOrder;
  next();
});

module.exports = checkOrderExists;
