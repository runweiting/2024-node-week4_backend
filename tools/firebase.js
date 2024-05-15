const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const admin = require('firebase-admin');
const config = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_X509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};
// 初始化 Firebase Admin SDK，帶入配置 Firebase 各種設定的物件作為參數
admin.initializeApp({
  // credential 驗證身份，admin.credential.cert(config) 使用 config 建立一個認證物件
  credential: admin.credential.cert(config),
  // 設定 Firebase storageBucket 存儲桶，使用了 ES6 的模板字串來動態生成存儲桶名稱，
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
});

module.exports = admin;
