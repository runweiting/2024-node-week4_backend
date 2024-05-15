// multer 是 Node.js 的中介軟體，用於處理表單中的 multipart/form-data 數據
const multer = require('multer');
// 載入 Node.js 內建 path 模組，用於處理文件路徑，可在不同操作系統下（如 Windows、Linux、macOS 等）處理文件路徑
const path = require('path');

const isImage = multer({
  // 2 (MB) * 1024 (KB/MB) * 1024 (bytes/KB) = 2,097,152 bytes
  limits: 2 * 1024 * 1024,
  fileFilter(req, file, next) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      next(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'));
    }
    // next 函數的第一個參數是錯誤，而第二個參數是布爾值，表示是否接受上傳的文件
    // next() = next(true) = next(null, true)，都表示接受上傳的文件
    next(null, true);
  },
}).any();

module.exports = isImage;
