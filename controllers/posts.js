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
    // 驗證輸入內容
    const { user, content, image } = req.body;
    if (!user) {
      return next(appError(400, '用戶 Id 為必填'));
    } else if (!content.trim()) {
      return next(appError(400, '貼文內容為必填'));
    } else if (image && !String(image).startsWith('http')) {
      return next(appError(400, '圖片網址錯誤'));
    }
    // 驗證用戶
    const targetUser = await User.findById(user);
    if (!targetUser) {
      return next(appError(400, '查無此用戶 Id'));
    }
    const newPost = await Post.create({
      user: user,
      content: content.trim(),
      image: image,
    });
    res.status(201).json({
      status: 'success',
      message: '新增成功',
      post: newPost,
    });
  },
  async updatePost(req, res, next) {
    const { content, image } = req.body;
    if (!content.trim()) {
      return next(appError(400, '貼文內容為必填'));
    }
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return next(appError(404, '查無此貼文 id'));
    } else {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          content: content.trim(),
          image: image,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      res.status(201).json({
        status: 'success',
        message: '更新成功',
        post: updatePost,
      });
    }
  },
  async deleteAllPost(req, res, next) {
    await Post.deleteMany({});
    res.status(200).json({
      status: 'success',
      message: '全部刪除成功',
    });
  },
  async deletePost(req, res, next) {
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return next(appError(404, '查無此貼文 id'));
    } else {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json({
        status: 'success',
        message: '刪除成功',
      });
    }
  },
};

module.exports = posts;
