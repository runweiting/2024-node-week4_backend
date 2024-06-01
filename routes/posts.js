const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/postsController');
const { handleErrorAsync } = require('../middlewares/handleResponses');
const isAuth = require('../middlewares/isAuth');

router.get(
  '/',
  isAuth,
  PostsController.getPosts,
  /**
   * #swagger.tags = ['社群動態 - 貼文 (posts)']
   * #swagger.description = '取得社群所有貼文 API'
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
            "content": "example",
            "image": "圖片連結(https)",
            "likes": [
              {
                "_id": "664c185bcd3fb...",
                "name": "example",
                "photo": "圖片連結(https)"
              },
            ],
            "tags": [
              "example1", "example2", "example3"
            ],
            "isPublic": true,
            "createdAt": "2024...",
            "updatedAt": "2024...",
            "comments": [
              {
                "_id": "664c185bcd3fb...",
                "comment": "example",
                "post": "664c185bcd3fb...",
                "user": {
                  "_id": "664c185bcd3fb...",
                  "name": "example",
                  "photo": "圖片連結(https)"
                }
              },
            ],
          },
        ]
      }
    }
  */
);

// 取得指定貼文
router.get(
  '/:id',
  isAuth,
  handleErrorAsync(PostsController.getPost),
  /**
   * #swagger.tags = ['社群動態 - 貼文 (posts)']
   * #swagger.description = '取得指定貼文 API'
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
            "user": "664c185bcd3fb...",
            "content": "example",
            "image": "圖片連結(https)",
            "likes": [
              {
                "_id": "664c185bcd3fb...",
                "name": "example",
                "photo": "圖片連結(https)"
              },
            ],
            "comments": 0,
            "tags": [
              "example"
            ],
            "isPublic": true,
            "createdAt": "2024...",
            "updatedAt": "2024..."
          },
        ]
      }
    }
    * #swagger.responses[404] = {
      description: 'Not Found',
      schema: {
        "status": false,
        "message": "查無此貼文 id",
      }
    }
  */
);

// 取得用戶所有貼文 (用戶牆)
router.get(
  '/user/:id',
  isAuth,
  handleErrorAsync(PostsController.getUserPosts),
  /**
   * #swagger.tags = ['社群動態 - 貼文 (posts)']
   * #swagger.description = '取得指定用戶所有貼文 (用戶牆) API'
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
            "user": "664c185bcd3fb...",
            "content": "example",
            "image": "圖片連結(https)",
            "likes": [
              {
                "_id": "664c185bcd3fb...",
                "name": "example",
                "photo": "圖片連結(https)"
              },
            ],
            "comments": 0,
            "tags": [
              "example"
            ],
            "isPublic": true,
            "createdAt": "2024...",
            "updatedAt": "2024..."
          },
        ]
      }
    }
    * #swagger.responses[404] = {
      description: 'Not Found',
      schema: {
        "status": false,
        "message": "目前用戶沒有貼文",
      }
    }
  */
);

router.post(
  '/',
  isAuth,
  handleErrorAsync(PostsController.createPost),
  /**
   * #swagger.tags = ['個人動態 - 貼文 (posts)']
   * #swagger.description = '個人新增貼文 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      schema: {
        '$content': 'example',
        '$image': '圖片連結(https)',
        '$tags': ['example1', 'example2', 'example3']
        }
      }
    }
   * #swagger.responses[201] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "新增成功"
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request',
      schema: {
        "status": false,
        "message": "圖片格式錯誤"
      }
    }
   */
);

router.put(
  '/:id',
  isAuth,
  handleErrorAsync(PostsController.updatePost),
  /**
   * #swagger.tags = ['個人動態 - 貼文 (posts)']
   * #swagger.description = '個人更新指定貼文 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      schema: {
        '$content': 'example',
        '$image': '圖片連結(https)',
        '$tags': ['example1', 'example2', 'example3']
        }
      }
    }
   * #swagger.responses[201] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "更新成功",
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request',
      schema: {
        "status": false,
        "message": "圖片格式錯誤"
      }
    }
   * #swagger.responses[404] = {
      description: 'Not Found',
      schema: {
        "status": false,
        "message": "查無此貼文 id",
      }
    }
   */
);

router.delete(
  '/:id',
  isAuth,
  handleErrorAsync(PostsController.deletePost),
  /**
   * #swagger.tags = ['個人動態 - 貼文 (posts)']
   * #swagger.description = '個人刪除指定貼文 API'
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
        "message": "查無此貼文 id",
      }
    }
   */
);

// 指定貼文按讚
router.post(
  '/:id/like',
  isAuth,
  handleErrorAsync(PostsController.likePost),
  /**
   * #swagger.tags = ['個人動態 - 貼文 (posts)']
   * #swagger.description = '指定貼文按讚 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
    * #swagger.responses[200] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "按讚成功",
        "data": [
          {
            "_id": "664c185bcd3fb...",
            "name": "example",
            "photo": "圖片連結(https)"
          },
        ]
      }
    }
    * #swagger.responses[404] = {
      description: 'Not Found',
      schema: {
        "status": false,
        "message": "查無此貼文 id",
      }
    }
  */
);

// 取消指定貼文按讚
router.delete(
  '/:id/unlike',
  isAuth,
  handleErrorAsync(PostsController.unlikePost),
  /**
   * #swagger.tags = ['個人動態 - 貼文 (posts)']
   * #swagger.description = '取消指定貼文按讚 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
    * #swagger.responses[200] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "已取消按讚",
      }
    }
    * #swagger.responses[404] = {
      description: 'Not Found',
      schema: {
        "status": false,
        "message": "查無此貼文 id",
      }
    }
  */
);

// 指定貼文留言
router.post(
  '/:id/comment',
  isAuth,
  handleErrorAsync(PostsController.createComment),
  /**
   * #swagger.tags = ['個人動態 - 貼文 (posts)']
   * #swagger.description = '指定貼文留言 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
    * #swagger.responses[201] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "新增成功",
        "data": [
          {
            "_id": "664c185bcd3fb...",
            "comment": "example",
            "post": "664c185bcd3fb...",
            "user": {
              "_id": "664c185bcd3fb...",
              "name": "example",
              "photo": "圖片連結(https)"
            }
          },
        ]
      },
    }
    * #swagger.responses[400] = {
      description: 'Bad Request',
      schema: {
        "status": false,
        "message": "留言為必填",
      }
    }
  */
);

// 刪除貼文留言
router.delete(
  '/:id/uncomment',
  isAuth,
  handleErrorAsync(PostsController.deleteComment),
  /**
   * #swagger.tags = ['個人動態 - 貼文 (posts)']
   * #swagger.description = '刪除指定貼文留言 API'
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
        "message": "查無此貼文 id",
      }
    }
  */
);

router.delete(
  '/all',
  isAuth,
  PostsController.deleteAllPost,
  /**
   * #swagger.tags = ['管理控制台 - 社群貼文 (posts)']
   * #swagger.description = '刪除全部社群貼文 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[200] = {
      description: 'OK',
      schema: {
        "status": true,
        "message": "全部刪除成功",
      }
    }
   */
);

module.exports = router;
