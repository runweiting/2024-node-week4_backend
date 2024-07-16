const crypto = require('crypto');
const {
  NEWEBPAY_MERCHANT_ID,
  NEWEBPAY_HASH_KEY,
  NEWEBPAY_HASH_IV,
  NEWEBPAY_VERSION,
  NEWEBPAY_RESPOND_TYPE,
  NEWEBPAY_NOTIFY_URL,
  NEWEBPAY_RETURN_URL,
  NEWEBPAY_CLIENTBACK_URL,
} = process.env;

/*
AES (Advanced Encryption Standard) 是一種對稱加密演算法，常用於數據加密。對稱加密意指加密和解密過程使用相同的密鑰。AES 支持三種密鑰長度：128、192 和 256 位，其中 AES-256 是最強的，因為它使用 256 位的密鑰。
CBC (Cipher Block Chaining) 是 AES 的一種區塊加密模式。
工作原理：
初始向量 (IV): 在 CBC 模式中，每個明文區塊在加密之前會先與上一個密文區塊進行 XOR 操作。第一個區塊沒有上一個密文區塊，所以它會與初始向量 (IV) 進行 XOR 操作。IV 是一個隨機生成的數據塊，確保相同的明文每次加密都會產生不同的密文。
區塊加密: 每個明文區塊會與上一個密文區塊（或 IV）進行 XOR，然後通過加密算法（AES-256）進行加密。
解密過程: 解密時，每個密文區塊會先通過解密算法解密，然後再與上一個密文區塊（或 IV）進行 XOR，以恢復原始明文。
如此使得每個區塊的加密結果依賴於前一個區塊，增強了加密的強度。
*/

// 1. 將請求字串加密：AES-256-CBC 加密訂單資料
function create_mpg_aes_encrypt(order) {
  try {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      NEWEBPAY_HASH_KEY,
      NEWEBPAY_HASH_IV,
    );
    let encrypted = cipher.update(genDataChain(order), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (err) {
    console.log('aes_encrypt 加密錯誤:', err);
  }
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
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      NEWEBPAY_HASH_KEY,
      NEWEBPAY_HASH_IV,
    );
    // 關閉自動填充（padding）
    decipher.setAutoPadding(false);
    let decrypted = decipher.update(tradeInfo, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.replace(/[\x00-\x20]+/g, '');
  } catch (err) {
    console.log('aes_decrypt 解密錯誤:', err);
  }
}

// 轉換 payTime 格式
function formattedPayTimeStr(payTime) {
  const formattedStr = payTime.slice(0, 10) + ' ' + payTime.slice(10);
  return new Date(formattedStr);
}

module.exports = {
  create_mpg_aes_encrypt,
  create_mpg_sha_encrypt,
  create_mpg_aes_decrypt,
  formattedPayTimeStr,
};
