var express = require('express');
var router = express.Router();
const PostsController = require('../controllers/posts');
const handleErrorAsync = require('../statusHandle/handleErrorAsync');

router.get('/', PostsController.getPosts);
router.post('/', handleErrorAsync(PostsController.createPost));
router.patch('/:id', PostsController.updatePost);
router.delete('/', PostsController.deleteAllPost);
router.delete('/:id', PostsController.deletePost);
router.options('/', async function (req, res, next) {
  res.status(200);
});

module.exports = router;
