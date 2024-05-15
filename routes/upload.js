const express = require('express');
const router = express.Router();
const {
  handleErrorAsync,
  handleAppError,
} = require('../statusHandle/handleResponses');
const { v4: uuidv4 } = require('uuid');
const isAuth = require('../tools/isAuth');
const isImage = require('../tools/isImage');
const firebaseAdmin = require('../tools/firebase');
// bucket 雲存儲桶是 Firebase Admin SDK 中對應於一個存儲桶的對象
const bucket = firebaseAdmin.storage().bucket();

router.post(
  '/file',
  isAuth,
  isImage,
  handleErrorAsync(async (req, res, next) => {
    if (!req.files.length) {
      return next(handleAppError(400, '尚未上傳檔案', next));
    }
    // 取得 req.files 陣列裡的第一個檔案
    const file = req.files[0];
    // 建立 blob 物件，使用 bucket.file() 引入 Firebase Storage 存儲桶中的文件
    const blob = bucket.file(
      `images/${uuidv4()}.${file.originalname.split('.').pop()}`,
    );
    console.log(blob);
    // 建立 blobStream，將數據寫入到 bucket，創建了一個寫入流 writable stream，將本地文件通過流的方式上傳到 Google Cloud storage
    const blobStream = blob.createWriteStream();
    // 監聽上傳狀態，上傳完成觸發 finish 事件
    blobStream.on('finish', () => {
      // 設定檔案存取權限，允許讀取文件、signedUrl 於 2500/12/31 到期
      const config = {
        action: 'read',
        expires: '12-31-2500',
      };
      // 取得檔案網址
      blob.getSignedUrl(config, (err, fileUrl) => {
        res.send({
          fileUrl,
        });
      });
    });
    // 如果上傳過程中發生錯誤，觸發 error 事件
    blobStream.on('error', (err) => {
      res.status(500).send('上傳失敗');
      console.error(err);
    });
    // file.buffer 是一個 Buffer，包含上傳文件的二進制數據，將數據寫入 Google Cloud Storage 的 Blob 中
    blobStream.end(file.buffer);
  }),
);

module.exports = router;
