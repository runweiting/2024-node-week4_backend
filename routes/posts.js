const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/posts');
const { handleErrorAsync } = require('../statusHandle/handleResponses');

router.get('/', PostsControllers.getPosts);
router.post('/', handleErrorAsync(PostsControllers.createPost));
router.patch('/:id', handleErrorAsync(PostsControllers.updatePost));
router.delete('/all', PostsControllers.deleteAllPost);
router.delete('/:id', handleErrorAsync(PostsControllers.deletePost));

module.exports = router;
