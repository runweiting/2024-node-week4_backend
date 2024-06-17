const nodemailer = require('nodemailer');
const oauth2Client = require('../config/googleOAuth2Client');

const createTransporter = async () => {
  const accessToken = await oauth2Client.getAccessToken();
  // 設置 SMTP 認證資料
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.NODEMAILER_TRANSPORT_USER,
      clientId: process.env.GOOGLE_GMAIL_CLIENT_ID,
      clientSecret: process.env.GOOGLE_GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_GMAIL_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
};
const sendEmail = async (to, subject, text = null, html = null) => {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.NODEMAILER_TRANSPORT_USER,
    to,
    subject,
    text,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
    // 自定返回結果，好讓 controllers 檢查發送結果，並依據其結果進行相應的處理
    return { status: true, message: '郵件發送成功' };
  } catch (err) {
    console.error('郵件發送失敗:', err);
    return { status: false, message: '郵件發送失敗', error: err };
  }
};

// 自動回覆郵件（不需由前端輸入郵件內容）
// 驗證註冊信箱
const sendVerificationEmail = async (user) => {
  const subject = '請驗證您的註冊信箱';
  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <h2 style="color: #4CAF50;">歡迎加入我們！</h2>
      <p>您的驗證碼是：</p>
      <h3 style="color: #4CAF50;">${user.verificationToken}</h3>
      <p>請將此驗證碼輸入至網站進行驗證。</p>
      <p>如果您沒有註冊此帳戶，請忽略此郵件。</p>
      <p>謝謝，<br/>您的公司名稱</p>
    </div>
  `;
  return sendEmail(user.email, subject, null, html);
};
// 其他通知信

module.exports = {
  sendVerificationEmail,
  sendEmail,
};
