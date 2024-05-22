const express = require('express');
const router = express.Router();
const {
  handleResponse,
  handleErrorAsync,
  handleAppError,
  handleErrorResponse,
  handleMulterError,
} = require('../middlewares/handleResponses');
// 使用 uuid 生成檔名唯一值，避免重複檔名
const { v4: uuidv4 } = require('uuid');
const isAuth = require('../middlewares/isAuth');
const isImage = require('../middlewares/isImage');
const firebaseAdmin = require('../tools/firebase');
// 建立 bucket 物件，以操作 storage 的儲存桶
const bucket = firebaseAdmin.storage().bucket();
const User = require('../models/usersModel');

router.post(
  '/file',
  isAuth,
  isImage,
  handleMulterError,
  handleErrorAsync(async (req, res, next) => {
    if (!req.files.length) {
      return handleAppError(400, '尚未上傳檔案', next);
    }
    // 取得 req.files 陣列裡的第一個檔案
    const file = req.files[0];
    // 建立 blob 物件，使用 bucket.file('images/name') 存放要上傳的資料夾名稱 image、檔案名稱 name
    const blob = bucket.file(
      `images/${uuidv4()}.${file.originalname.split('.').pop()}`,
    );
    // 建立可寫入 blob 的 blobStream 物件 (寫入流 writable stream)，將數據寫入到 bucket 儲存桶中
    const blobStream = blob.createWriteStream();
    // 使用 blobStream 物件來監聽檔案的上傳狀態，當上傳完成時，觸發 finish 事件
    blobStream.on('finish', async () => {
      // 設定檔案存取權限，action、expires 為必填
      const config = {
        // 讀取權限
        action: 'read',
        // 網址的有效期限
        expires: '12-31-2500',
      };
      // 取得檔案網址
      blob.getSignedUrl(config, async (err, fileUrl) => {
        if (err) {
          return handleAppError(500, '取得檔案網址失敗', next);
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
    // Buffer 是 Node.js 中用於處理和傳遞二進制數據的類
    // 將上傳的文件數據 file.buffer 寫入到 blobStream 中
    // 當數據寫入完成後，自動關閉 blobStream 以完成寫入操作
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
