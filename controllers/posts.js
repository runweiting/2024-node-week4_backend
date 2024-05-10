const {
  handleResponse,
  handleAppError,
} = require('../statusHandle/handleResponses');
const Post = require('../models/postsModel');
const User = require('../models/usersModel');

const posts = {
  async getPosts(req, res, next) {
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt';
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const posts = await Post.find(q)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .populate({
        path: 'likes',
        select: 'name photo',
      })
      .sort(timeSort);
    handleResponse(res, 200, '查詢成功', posts);
  },
  async createPost(req, res, next) {
    // 驗證輸入內容
    const { user, content, image, tags } = req.body;
    if (!user) {
      return next(handleAppError(400, '用戶 Id 為必填'));
    } else if (!content.trim()) {
      return next(handleAppError(400, '貼文內容為必填'));
    } else if (image && !String(image).startsWith('http')) {
      return next(handleAppError(400, '圖片網址錯誤'));
    } else if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return next(handleAppError(400, '標籤為必填'));
    }
    // 驗證用戶
    const targetUser = await User.findById(user);
    if (!targetUser) {
      return next(handleAppError(400, '查無此用戶 Id'));
    }
    const newPost = await Post.create({
      user: user,
      content: content.trim(),
      image: image,
      tags: tags,
    });
    handleResponse(res, 201, '新增成功', newPost);
  },
  async updatePost(req, res, next) {
    const { content, image, tags } = req.body;
    if (!content.trim()) {
      return next(handleAppError(400, '貼文內容為必填'));
    } else if (image && !String(image).startsWith('http')) {
      return next(handleAppError(400, '圖片網址錯誤'));
    } else if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return next(handleAppError(400, '標籤為必填'));
    }
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return next(handleAppError(404, '查無此貼文 id'));
    } else {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          content: content.trim(),
          image: image,
          tags: tags,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      handleResponse(res, 201, '更新成功', updatePost);
    }
  },
  async deleteAllPost(req, res, next) {
    await Post.deleteMany({});
    handleResponse(res, 200, '全部刪除成功');
  },
  async deletePost(req, res, next) {
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return next(handleAppError(404, '查無此貼文 id'));
    } else {
      await Post.findByIdAndDelete(req.params.id);
      handleResponse(res, 200, "刪除成功'");
    }
  },
};

module.exports = posts;
