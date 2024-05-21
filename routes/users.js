const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users');
const { handleErrorAsync } = require('../statusHandle/handleResponses');
const isAuth = require('../tools/isAuth');

router.post(
  '/sign-up',
  handleErrorAsync(UsersControllers.signUp),
  /**
   * #swagger.tags = ['用戶 - 登入及註冊']
   * #swagger.description = '用戶註冊 API'
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      schema: {
        '$name': 'example',
        '$email': 'example@test.com',
        '$password': 'example',
        '$confirmPassword': 'example'
      }
    }
   * #swagger.responses[200] = {
      description: '註冊成功',
      schema: {
        "status": true,
        "message": "註冊成功",
        "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6InRCME0yQSJ9....",
        "expired": 1630734430297
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request'
    }
   */
);

router.post(
  '/sign-in',
  handleErrorAsync(UsersControllers.signIn),
  /**
   * #swagger.tags = ['用戶 - 登入及註冊']
   * #swagger.description = '用戶登入 API'
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      schema: {
        '$email': 'example@test.com',
        '$password': 'example'
      }
    }
   * #swagger.responses[200] = {
      description: '登入成功',
      schema: {
        "status": true,
        "message": "登入成功",
        "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6InRCME0yQSJ9....",
        "expired": 1630734430297
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request'
    }
   */
);

router.post(
  '/sign-out',
  isAuth,
  UsersControllers.signOut,
  /**
   * #swagger.tags = ['用戶 - 登入及註冊']
   * #swagger.description = '用戶登出 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[200] = {
      description: '登出成功',
    }
   * #swagger.responses[400] = {
      description: 'Bad Request'
    }
   */
);

router.get(
  '/profile',
  isAuth,
  handleErrorAsync(UsersControllers.getProfile),
  /**
   * #swagger.tags = ['用戶 - 個人檔案 (Users)']
   * #swagger.description = '取得個人檔案 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[200] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "查詢成功",
        "data": {
          "_id": "664c185bcd3fb...",
          "name": "example",
          "role": "example",
          "photo": "圖片連結(https)",
          "createdAt": "2024...",
          "updatedAt": "2024...",
          "gender": "example"
        }
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request'
    }
   */
);

router.patch(
  '/update-password',
  isAuth,
  handleErrorAsync(UsersControllers.updatePassword),
  /**
   * #swagger.tags = ['用戶 - 個人檔案 (Users)']
   * #swagger.description = '更新個人密碼 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      schema: {
        '$password': 'example',
        '$confirmPassword': 'example'
      }
    }
   * #swagger.responses[201] = {
      description: '更新成功',
      schema: {
        "status": true,
        "message": "密碼更新成功",
        "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6InRCME0yQSJ9....",
        "expired": 1630734430297
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request'
    }
   */
);

router.patch(
  '/profile',
  isAuth,
  handleErrorAsync(UsersControllers.updateProfile),
  /**
   * #swagger.tags = ['用戶 - 個人檔案 (Users)']
   * #swagger.description = '更新個人檔案 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      schema: {
        '$name': 'example',
        '$gender': 'example',
        '$photo': '圖片連結(https)'
      }
    }
   * #swagger.responses[201] = {
      description: '更新成功',
      schema: {
        "status": true,
        "message": "個人資料更新成功",
        "data": {
          "_id": "664c185bcd3fb...",
          "name": "example",
          "role": "example",
          "photo": "圖片連結(https)",
          "createdAt": "2024...",
          "updatedAt": "2024...",
          "gender": "example"
        }
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request'
    }
   */
);
module.exports = router;
