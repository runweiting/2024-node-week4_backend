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
   * #swagger.tags = ['動態貼文 - 貼文']
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
   * #swagger.responses[400] = {
      description: 'Bad Request'
    }
  */
);

router.post(
  '/',
  isAuth,
  handleErrorAsync(PostsController.createPost),
  /**
   * #swagger.tags = ['動態貼文 - 貼文']
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
   * #swagger.tags = ['動態貼文 - 貼文']
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
   * #swagger.tags = ['動態貼文 - 貼文']
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
   * #swagger.tags = ['動態貼文 - 貼文']
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

// 貼文按讚
router.post(
  '/:id/like',
  isAuth,
  handleErrorAsync(PostsController.likePost),
  /**
   * #swagger.tags = ['動態貼文 - 按讚']
   * #swagger.description = '按一則貼文的讚 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
    * #swagger.responses[200] = {
      description: '貼文按讚成功',
      schema: {
        "status": true,
        "message": "貼文按讚成功",
      }
    }
    * #swagger.responses[404] = {
      description: '查無此貼文 id',
      schema: {
        "status": false,
        "message": "查無此貼文 id",
      }
    }
  */
);
// 取消貼文按讚
router.delete(
  '/:id/unlike',
  isAuth,
  handleErrorAsync(PostsController.unlikePost),
  /**
   * #swagger.tags = ['動態貼文 - 按讚']
   * #swagger.description = '取消指定貼文的讚 API'
   * #swagger.security = [{
      "apiKeyAuth": []
    }]
    * #swagger.responses[200] = {
      description: '貼文按讚已取消',
      schema: {
        "status": true,
        "message": "貼文按讚已取消",
      }
    }
    * #swagger.responses[404] = {
      description: '查無此貼文 id',
      schema: {
        "status": false,
        "message": "查無此貼文 id",
      }
    }
  */
);
// 取得個人所有貼文列表
router.get(
  '/user/:id',
  isAuth,
  handleErrorAsync(PostsController.getUserPosts),
  /**
   * #swagger.tags = ['動態貼文 - 貼文']
   * #swagger.description = '取得個人貼文列表 API'
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
    * #swagger.responses[400] = {
      description: 'Bad Request'
    }
  */
);

module.exports = router;
