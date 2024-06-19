const express = require('express');
const router = express.Router();
const passport = require('passport');
const UsersController = require('../controllers/usersController');
const { handleErrorAsync } = require('../middlewares/handleResponses');
const isAuth = require('../middlewares/isAuth');
const { generateUrlJWT } = require('../middlewares/generateJWT');

router.post(
  '/sign-up',
  handleErrorAsync(UsersController.signUp),
  /**
   * #swagger.tags = ['會員功能 - 登入註冊 (users)']
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
   * #swagger.responses[201] = {
      description: 'OK',
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
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.post(
  '/sign-in',
  handleErrorAsync(UsersController.signIn),
  /**
   * #swagger.tags = ['會員功能 - 登入註冊 (users)']
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
      description: 'OK',
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
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.post(
  '/sign-out',
  isAuth,
  UsersController.signOut,
  /**
   * #swagger.tags = ['會員功能 - 登入註冊 (users)']
   * #swagger.description = '用戶登出 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[200] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "登出成功"
      }
    }
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.get(
  '/profile',
  isAuth,
  handleErrorAsync(UsersController.getProfile),
  /**
   * #swagger.tags = ['會員功能 - 個人設定 (users)']
   * #swagger.description = '取得個人設定 API'
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
          "followers": [
            {
              "user": "664c185bcd3fb...",
              "_id": "664c185bcd3fb...",
              "createdAt": "2024..."
            },
          ],
          "following": [
            {
              "user": "664c185bcd3fb...",
              "_id": "664c185bcd3fb...",
              "createdAt": "2024..."
            },
          ],
          "createdAt": "2024...",
          "updatedAt": "2024...",
          "gender": "example"
        }
      }
    }
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.patch(
  '/update-password',
  isAuth,
  handleErrorAsync(UsersController.updatePassword),
  /**
   * #swagger.tags = ['會員功能 - 個人設定 (users)']
   * #swagger.description = '重設個人密碼 API'
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
      description: 'OK',
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
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.put(
  '/profile',
  isAuth,
  handleErrorAsync(UsersController.updateProfile),
  /**
   * #swagger.tags = ['會員功能 - 個人設定 (users)']
   * #swagger.description = '更新個人設定 API'
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
      description: 'OK',
      schema: {
        "status": true,
        "message": "個人資料更新成功",
        "data": {
          "_id": "664c185bcd3fb...",
          "name": "example",
          "role": "example",
          "photo": "圖片連結(https)",
          "followers": [
            {
              "user": "664c185bcd3fb...",
              "_id": "664c185bcd3fb...",
              "createdAt": "2024..."
            },
          ],
          "following": [
            {
              "user": "664c185bcd3fb...",
              "_id": "664c185bcd3fb...",
              "createdAt": "2024..."
            },
          ],
          "createdAt": "2024...",
          "updatedAt": "2024...",
          "gender": "example"
        }
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request'
    }
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.get(
  '/liked-posts',
  isAuth,
  handleErrorAsync(UsersController.getLikedPosts),
  /**
   * #swagger.tags = ['會員功能 - 追蹤、編輯按讚貼文 (users)']
   * #swagger.description = '取得按讚貼文列表 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[200] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "查詢成功",
        "data": [
          {
            "_id": "664c185bcd3fb...",
            "user": {
              "_id": "664c185bcd3fb...",
              "name": "example",
              "photo": "圖片連結(https)"
            },
            "post": {
              "_id": "664c185bcd3fb...",
              "user": {
                "_id": "664c185bcd3fb...",
                "name": "example",
                "photo": "圖片連結(https)"
              },
              "content": "example",
              "image": "圖片連結(https)",
              "tags": [
                "example"
              ],
              "createdAt": "2024...",
              "id": "664c185bcd3fb..."
            },
            "createdAt": "2024...",
            "updatedAt": "2024..."
          },
        ]
      }
    }
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.delete(
  '/:id/liked-post',
  isAuth,
  handleErrorAsync(UsersController.deleteLikedPost),
  /**
   * #swagger.tags = ['會員功能 - 追蹤、編輯按讚貼文 (users)']
   * #swagger.description = '刪除指定按讚貼文 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[200] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "刪除成功",
      }
    }
   * #swagger.responses[404] = {
      description: 'Not Found',
      schema: {
        "status": false,
        "message": "查無此貼文 id"
      }
    }
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.get(
  '/following',
  isAuth,
  handleErrorAsync(UsersController.getFollowingList),
  /**
   * #swagger.tags = ['會員功能 - 追蹤、編輯按讚貼文 (users)']
   * #swagger.description = '取得追蹤名單 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[200] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "查詢成功",
        "data": [
          {
            "_id": "664c185bcd3fb...",
            "name": "example",
            "photo": "圖片連結(https)",
            "createdAt": "2024..."
          }
        ]
      }
    }
   * #swagger.responses[404] = {
      description: 'Not Found',
      schema: {
        "status": false,
        "message": "查無用戶追蹤名單"
      }
    }
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.post(
  '/:id/follow',
  isAuth,
  handleErrorAsync(UsersController.followUser),
  /**
   * #swagger.tags = ['會員功能 - 追蹤、編輯按讚貼文 (users)']
   * #swagger.description = '追蹤指定用戶 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[201] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "追蹤成功",
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request',
      schema: {
        "status": false,
        "message": "您無法追蹤自己"
      }
    }
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.delete(
  '/:id/unfollow',
  isAuth,
  handleErrorAsync(UsersController.unfollowUser),
  /**
   * #swagger.tags = ['會員功能 - 追蹤、編輯按讚貼文 (users)']
   * #swagger.description = '取消追蹤指定用戶 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[200] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "已取消追蹤",
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request',
      schema: {
        "status": false,
        "message": "您無法取消追蹤自己"
      }
    }
   * #swagger.headers['Content-Type'] = {
      description: 'The content type',
      type: 'string'
    }
   */
);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
  /**
   * #swagger.ignore = true
   */
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    generateUrlJWT(req.user, res);
  },
  /**
   * #swagger.ignore = true
   */
);

module.exports = router;
