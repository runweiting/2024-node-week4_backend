const { handleAppError, handleErrorAsync } = require('./handleResponses');
const Order = require('../models/ordersModel');
const { create_mpg_aes_decrypt } = require('../middlewares/encryption');

// 檢查訂單是否存在
const checkOrderExists = handleErrorAsync(async (req, res, next) => {
  // 可能因測試機 response 沒有顯示 CheckCode (手冊有寫 p.23, p.50)
  const decryptData = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo));
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
