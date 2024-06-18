const mongoose = require('mongoose');
const DB = process.env.MONGODB_ATLAS_URL.replace(
  '<password>',
  process.env.MONGODB_ATLAS_PASSWORD,
);

mongoose
  .connect(DB, {
    // 使用新的 URL 解析器來解析 MongoDB 連接字符串
    useNewUrlParser: true,
    // 啟用新的 MongoDB 驅動引擎，稱為「統一拓撲設置」(Unified Topology)
    useUnifiedTopology: true,
  })
  .then((res) => console.log('資料庫連線成功'))
  .catch((err) => console.log('資料庫連接有誤', err.message));
