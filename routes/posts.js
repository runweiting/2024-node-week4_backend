const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/posts');
const { handleErrorAsync } = require('../statusHandle/handleResponses');
const isAuth = require('../tools/isAuth');

router.get('/', isAuth, PostsControllers.getPosts);
router.post('/', isAuth, handleErrorAsync(PostsControllers.createPost));
router.patch('/:id', isAuth, handleErrorAsync(PostsControllers.updatePost));
router.delete('/all', isAuth, PostsControllers.deleteAllPost);
router.delete('/:id', isAuth, handleErrorAsync(PostsControllers.deletePost));

module.exports = router;
