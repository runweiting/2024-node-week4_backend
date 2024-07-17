const {
  handleResponse,
  handleAppError,
} = require('../middlewares/handleResponses');
const Order = require('../models/ordersModel');
const User = require('../models/usersModel');
const { NEWEBPAY_MERCHANT_ID, NEWEBPAY_VERSION, NEWEBPAY_CCORE } = process.env;
const {
  create_mpg_aes_encrypt,
  create_mpg_sha_encrypt,
  create_mpg_aes_decrypt,
  formattedPayTimeStr,
} = require('../middlewares/encryption');

const orders = {
  async createOrder(req, res, next) {
    const { userId, amt, itemDesc } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return handleAppError(404, '用戶不存在', next);
    }
    const newOrder = await Order.create({
      user: userId,
      amt,
      itemDesc,
    });
    handleResponse(res, 201, '新增成功', newOrder._id.toString());
  },
  async getOrder(req, res, next) {
    const { id } = req.params;
    const targetOrder = await Order.findById(id).populate({
      path: 'user',
      select: 'email',
    });
    if (!targetOrder) {
      return handleAppError(404, '訂單不存在', next);
    }
    // 加密、建立 tradeInfo 物件並回傳
    const aesEncrypt = create_mpg_aes_encrypt(targetOrder);
    const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt);
    const tradeInfo = {
      MerchantID: NEWEBPAY_MERCHANT_ID.toString(),
      TradeInfo: aesEncrypt,
      TradeSha: shaEncrypt,
      Version: NEWEBPAY_VERSION,
      PayGateWay: NEWEBPAY_CCORE,
    };
    handleResponse(res, 200, '查詢成功', tradeInfo);
  },
  async checkStatus(req, res, next) {
    const { id } = req.params;
    const targetOrder = await Order.findById(id).select(
      'amt itemDesc isPaid merchantOrderNo status',
    );
    if (!targetOrder) {
      return handleAppError(404, '訂單不存在', next);
    }
    handleResponse(res, 201, '查詢成功', targetOrder);
  },
  async newebpayNotify(req, res, next) {
    console.log('notify 收到付款');
    const decryptData = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo));
    // 驗證一、檢查訂單是否已付款
    if (req.order.isPaid) {
      // 更新訂單 status
      await Order.findByIdAndUpdate(req.order._id, { status: '已付款' });
      // 回傳藍新 200 OK
      return res.status(200).send('付款成功');
    }
    // 驗證二、比對 SHA 加密字串
    const testShaEncrypt = create_mpg_sha_encrypt(req.body.TradeInfo);
    if (req.body.TradeSha !== testShaEncrypt) {
      return handleAppError(404, '付款失敗：TradeSha 不一致', next);
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      req.order._id,
      {
        isPaid: true,
        tradeInfo: {
          status: decryptData.Status,
          message: decryptData.Message,
          tradeNo: decryptData.Result.TradeNo,
          ip: decryptData.Result.IP,
          escrowBank: decryptData.Result.EscrowBank,
          paymentType: decryptData.Result.PaymentType,
          payTime: formattedPayTimeStr(decryptData.Result.PayTime),
          payerAccount5Code: decryptData.Result.PayerAccount5Code,
          payBankCode: decryptData.Result.PayBankCode,
        },
      },
      { new: true },
    );
    // 更新 req.order 狀態
    req.order.isPaid = updatedOrder.isPaid;
    // 交易完成，將成功資訊儲存於資料庫
    console.log('notify 付款完成！訂單編號：', req.order.merchantOrderNo);
  },
};

module.exports = orders;
