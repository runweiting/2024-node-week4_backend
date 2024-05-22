const express = require('express');
const router = express.Router();
const {
  handleResponse,
  handleErrorAsync,
  handleAppError,
  handleErrorResponse,
  handleMulterError,
} = require('../middlewares/handleResponses');
const { v4: uuidv4 } = require('uuid');
const isAuth = require('../middlewares/isAuth');
const isImage = require('../middlewares/isImage');
const firebaseAdmin = require('../tools/firebase');
// bucket 雲存儲桶是 Firebase Admin SDK 中對應於一個存儲桶的對象
const bucket = firebaseAdmin.storage().bucket();
const User = require('../models/usersModel');

router.post(
  '/file',
  isAuth,
  isImage,
  handleMulterError,
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
    // 建立 blobStream，將數據寫入到 bucket，創建了一個寫入流 writable stream，將本地文件通過流的方式上傳到 Google Cloud storage
    const blobStream = blob.createWriteStream();
    // 監聽上傳狀態，上傳完成觸發 finish 事件
    blobStream.on('finish', async () => {
      // 設定檔案存取權限，允許讀取文件、signedUrl 於 2500/12/31 到期
      const config = {
        action: 'read',
        expires: '12-31-2500',
      };
      // 取得檔案網址
      blob.getSignedUrl(config, async (err, fileUrl) => {
        if (err) {
          return next(handleAppError(500, '取得檔案網址失敗'));
        }
        await User.findByIdAndUpdate(req.user.id, {
          photo: fileUrl,
        });
        handleResponse(res, 200, '大頭照更新成功');
      });
    });
    // 如果上傳過程中發生錯誤，觸發 error 事件
    blobStream.on('error', (err) => {
      handleErrorResponse(res, 500, '上傳失敗');
      console.error(err);
    });
    // file.buffer 是一個 Buffer，包含上傳文件的二進制數據，將數據寫入 Google Cloud Storage 的 Blob 中
    blobStream.end(file.buffer);
  }),
  /**
   * #swagger.tags = ['用戶 - 圖片上傳 (Uploads)']
   * #swagger.description = '用戶圖片上傳 API<br>請注意，僅限使用 jpg、jpeg 與 png 格式，檔案大小限制為 1MB 以下。<br><br>
   ```
   <form action="/upload/file" enctype="multipart/form-data" method="post"><input type="file" name="file-to-upload"><input type="submit" value="Upload"></form>
   ```'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.parameters['upload'] = {
      in: 'body',
      required: true,
      schema: {
        file: {
          type: 'file',
          format: 'binary',
          description: '圖片檔案',
          required: true,
        }
      }
    }
   * #swagger.responses[200] = {
      description: '上傳成功',
      schema: {
        "status": true,
        "message": "大頭照更新成功",
      }
    }
   * #swagger.responses[400] = {
      description: '上傳失敗',
      schema: {
        "status": false,
        "message": "大頭照更新失敗",
      }
    }
   }
   */
);

module.exports = router;
