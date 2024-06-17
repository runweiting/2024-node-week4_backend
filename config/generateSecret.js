// 僅限於測試環境使用
const crypto = require('crypto');

function generateSecret() {
  // crypto 是 Node.js 模組，可生成隨機數字、散列、加密和解密，.randomBytes 生成 32 個隨機位元的 Buffer 對象，.toString 將 Buffer 中的數據轉換為字串，'hex' 指定將數據轉換為十六進制（hex）格式的字串，每個字節將被轉換為兩個十六進制字符，最終產生一個 64 字符長的十六進制字串
  return crypto.randomBytes(32).toString('hex');
}

module.exports = generateSecret;
