const appError = require('../statusHandle/appError');
const Post = require('../models/postsModel');
const User = require('../models/usersModel');

const posts = {
  async getPosts(req, res, next) {
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const posts = await Post.find(q)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .sort(timeSort);
    res.status(200).json({
      status: 'success',
      message: '查詢成功',
      post: posts,
    });
  },
  async createPost(req, res, next) {
    const { body } = req;
    if (body.content == undefined) {
      return next(appError(400, '內容為必填'));
    }
    const newPost = await Post.create({
      user: body.user,
      content: body.content.trim(),
      image: body.image,
      likes: body.likes,
    });
    if (newPost !== null) {
      res.status(200).json({
        status: 'success',
        message: '新增成功',
        post: newPost,
      });
    } else {
      return next(appError(400, '內容為必填'));
    }
  },
  async updatePost(req, res, next) {
    const { body } = req;
    const id = req.params.id;
    if (body.content == undefined) {
      return next(appError(400, '內容為必填'));
    }
    const updatePost = await Post.findByIdAndUpdate(
      id,
      {
        content: body.content.trim(),
        image: body.image,
        likes: body.likes,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (updatePost !== null) {
      res.status(200).json({
        status: 'success',
        message: '更新成功',
        post: updatePost,
      });
    } else {
      return next(appError(400, '查無此貼文 id'));
    }
  },
  async deleteAllPost(req, res, next) {
    const route = req.originalUrl.split('?')[0];
    if (route === '/posts/') {
      return next(appError(400, '請提供正確的貼文 id'));
    } else {
      await Post.deleteMany({});
      res.status(200).json({
        status: 'success',
        message: '全部刪除成功',
      });
    }
  },
  async deletePost(req, res, next) {
    const id = req.params.id;
    const deletePost = await Post.findOneAndDelete(id);
    if (deletePost !== null) {
      res.status(200).json({
        status: 'success',
        message: '刪除成功',
      });
    } else {
      return next(appError(400, '查無此貼文 id'));
    }
  },
};

module.exports = posts;
