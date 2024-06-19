const { google } = require('googleapis');

// 1. 建立 OAuth2Client 實體
const OAuth2 = google.auth.OAuth2;
// 2. 建立 OAuth2Client 資料
const oauth2Client = new OAuth2(
  process.env.GOOGLE_GMAIL_CLIENT_ID,
  process.env.GOOGLE_GMAIL_CLIENT_SECRET,
  process.env.GOOGLE_GMAIL_REDIRECT_URI,
);
// 3. 設置 oauth2Client 憑證
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_GMAIL_REFRESH_TOKEN,
});

module.exports = oauth2Client;
