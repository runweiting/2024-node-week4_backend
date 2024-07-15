const {
  handleResponse,
  handleAppError,
} = require('../middlewares/handleResponses');
const crypto = require('crypto');
const Order = require('../models/ordersModel');
const User = require('../models/usersModel');
const {
  NEWEBPAY_MERCHANT_ID,
  NEWEBPAY_HASH_KEY,
  NEWEBPAY_HASH_IV,
  NEWEBPAY_VERSION,
  NEWEBPAY_RESPOND_TYPE,
  NEWEBPAY_NOTIFY_URL,
  NEWEBPAY_RETURN_URL,
  NEWEBPAY_CCORE,
  NEWEBPAY_CLIENTBACK_URL,
} = process.env;

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
    const order = await Order.findById(id).populate({
      path: 'user',
      select: 'email',
    });
    if (!order) {
      return handleAppError(404, '訂單不存在', next);
    }
    // 加密
    const aesEncrypt = create_mpg_aes_encrypt(order);
    const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt);
    // 回傳加密
    const tradeInfo = {
      MerchantID: NEWEBPAY_MERCHANT_ID.toString(),
      TradeInfo: aesEncrypt,
      TradeSha: shaEncrypt,
      Version: NEWEBPAY_VERSION,
      PayGateWay: NEWEBPAY_CCORE,
    };
    handleResponse(res, 200, '查詢成功', tradeInfo);
  },
  async newebpayNotify(req, res, next) {
    const decryptData = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo));
    // 驗證一、檢查訂單是否已付款
    if (req.targetOrder.isPaid) {
      console.log(`訂單編號：${req.targetOrder.merchantOrderNo} 已付款。`);
      return handleResponse(res, 200, '訂單已付款');
    }
    // 驗證二、比對 SHA 加密字串
    const testShaEncrypt = create_mpg_sha_encrypt(req.body.TradeInfo);
    if (req.body.TradeSha !== testShaEncrypt) {
      return handleAppError(404, '付款失敗：TradeSha 不一致', next);
    }
    await Order.findByIdAndUpdate(req.targetOrder._id, {
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
    });
    // 交易完成，將成功資訊儲存於資料庫
    console.log('付款完成！訂單編號：', req.targetOrder.merchantOrderNo);
  },
};

// 1. 將請求字串加密：AES-256-CBC 加密訂單資料
/*
AES (Advanced Encryption Standard) 是一種對稱加密演算法，常用於數據加密。對稱加密意指加密和解密過程使用相同的密鑰。AES 支持三種密鑰長度：128、192 和 256 位，其中 AES-256 是最強的，因為它使用 256 位的密鑰。
CBC (Cipher Block Chaining) 是 AES 的一種區塊加密模式。
工作原理：
初始向量 (IV): 在 CBC 模式中，每個明文區塊在加密之前會先與上一個密文區塊進行 XOR 操作。第一個區塊沒有上一個密文區塊，所以它會與初始向量 (IV) 進行 XOR 操作。IV 是一個隨機生成的數據塊，確保相同的明文每次加密都會產生不同的密文。
區塊加密: 每個明文區塊會與上一個密文區塊（或 IV）進行 XOR，然後通過加密算法（AES-256）進行加密。
解密過程: 解密時，每個密文區塊會先通過解密算法解密，然後再與上一個密文區塊（或 IV）進行 XOR，以恢復原始明文。
如此使得每個區塊的加密結果依賴於前一個區塊，增強了加密的強度。
*/
function create_mpg_aes_encrypt(order) {
  const encrypt = crypto.createCipheriv(
    'aes-256-cbc',
    NEWEBPAY_HASH_KEY,
    NEWEBPAY_HASH_IV,
  );
  const enc = encrypt.update(genDataChain(order), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}

// 2. 生成請求字串：排列參數並串聯
function genDataChain(order) {
  // 基本資料
  const data = {
    MerchantID: NEWEBPAY_MERCHANT_ID,
    RespondType: NEWEBPAY_RESPOND_TYPE,
    TimeStamp: Math.floor(order.timestamp / 1000).toString(),
    Version: NEWEBPAY_VERSION,
    MerchantOrderNo: order.merchantOrderNo,
    Amt: order.amt,
    ItemDesc: encodeURIComponent(order.itemDesc),
    Email: encodeURIComponent(order.user.email),
    NotifyURL: encodeURIComponent(NEWEBPAY_NOTIFY_URL),
    ReturnURL: encodeURIComponent(NEWEBPAY_RETURN_URL),
    ClientBackURL: encodeURIComponent(NEWEBPAY_CLIENTBACK_URL),
  };
  const dataChain = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return dataChain;
}

// 3. 將 AES 加密字串產生檢查碼：SHA-256 加密驗證資料
function create_mpg_sha_encrypt(aesEncrypt) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${NEWEBPAY_HASH_KEY}&${aesEncrypt}&HashIV=${NEWEBPAY_HASH_IV}`;
  return sha.update(plainText).digest('hex').toUpperCase();
}

// 4. 將 AES 加密字串進行解密
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

function formattedPayTimeStr(payTime) {
  const formattedStr = payTime.slice(0, 10) + ' ' + payTime.slice(10);
  return new Date(formattedStr);
}

module.exports = orders;
