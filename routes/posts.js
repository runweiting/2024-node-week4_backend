const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/posts');
const handleErrorAsync = require('../statusHandle/handleErrorAsync');

router.get('/', PostsController.getPosts);
router.post('/', handleErrorAsync(PostsController.createPost));
router.patch('/:id', handleErrorAsync(PostsController.updatePost));
router.delete('/all', PostsController.deleteAllPost);
router.delete('/:id', handleErrorAsync(PostsController.deletePost));
router.options('/', async function (req, res, next) {
  res.status(200);
});

module.exports = router;
