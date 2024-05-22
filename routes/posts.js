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
   * #swagger.tags = ['用戶 - 貼文 (Posts)']
   * #swagger.description = '取得全部貼文 API'
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
            "likes": [],
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
  */
);

router.post(
  '/',
  isAuth,
  handleErrorAsync(PostsController.createPost),
  /**
   * #swagger.tags = ['用戶 - 貼文 (Posts)']
   * #swagger.description = '新增貼文 API'
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
   * #swagger.responses[200] = {
      description: '新增成功',
      schema: {
        "status": true,
        "message": "新增成功"
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request'
    }
   */
);

router.patch(
  '/:id',
  isAuth,
  handleErrorAsync(PostsController.updatePost),
  /**
   * #swagger.tags = ['用戶 - 貼文 (Posts)']
   * #swagger.description = '更新指定貼文 API'
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
   * #swagger.responses[200] = {
      description: '貼文更新成功',
      schema: {
        "status": true,
        "message": "更新成功",
      }
    }
   * #swagger.responses[400] = {
      description: 'Bad Request'
    }
   */
);

router.delete(
  '/all',
  isAuth,
  PostsController.deleteAllPost,
  /**
   * #swagger.tags = ['用戶 - 貼文 (Posts)']
   * #swagger.description = '刪除全部貼文 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[200] = {
      description: '刪除成功',
      schema: {
        "status": true,
        "message": "全部刪除成功",
      }
    }
   */
);

router.delete(
  '/:id',
  isAuth,
  handleErrorAsync(PostsController.deletePost),
  /**
   * #swagger.tags = ['用戶 - 貼文 (Posts)']
   * #swagger.description = '刪除指定貼文 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
   * #swagger.responses[200] = {
      description: '刪除成功',
      schema: {
        "status": true,
        "message": "刪除成功",
      }
    }
   */
);

module.exports = router;
