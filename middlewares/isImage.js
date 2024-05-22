// Node.js 的 middleware，處理表單中的 multipart/form-data
const multer = require('multer');
// Node.js 內建 path 模組，處理文件路徑
const path = require('path');
const { handleAppError } = require('../middlewares/handleResponses');
// 將圖檔暫存在記憶體中，適合臨時小型檔案，處理完請求後被自動清除
const storage = multer.memoryStorage();

const isImage = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return handleAppError(
        400,
        '檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。',
        cb,
      );
    }
    // 第一個參數是錯誤，第二個參數是 Boolean，表示是否接受上傳的文件
    // next() = next(true) = next(null, true)，都表示接受上傳的文件
    cb(null, true);
  },
}).any();

module.exports = isImage;
