var express = require('express');
var router = express.Router();
const PostsController = require('../controllers/posts');
const handleErrorAsync = require('../statusHandle/handleErrorAsync');
const appError = require('../statusHandle/appError');

// 檢查必填
const contentRequired = (req, res, next) => {
  if (req.body.content !== undefined) {
    next();
  } else {
    next(appError(400, '內容為必填'));
  }
};

router.get('/', PostsController.getPosts);
router.post('/', contentRequired, handleErrorAsync(PostsController.createPost));
router.patch('/:id', handleErrorAsync(PostsController.updatePost));
router.delete('/', PostsController.deleteAllPost);
router.delete('/:id', handleErrorAsync(PostsController.deletePost));
router.options('/', async function (req, res, next) {
  res.status(200);
});

module.exports = router;
