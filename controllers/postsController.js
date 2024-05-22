const {
  handleResponse,
  handleAppError,
} = require('../middlewares/handleResponses');
const Post = require('../models/postsModel');

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
    const { content, image, tags } = req.body;
    if (!content.trim()) {
      return handleAppError(400, '貼文內容為必填', next);
    } else if (image && !String(image).startsWith('http')) {
      return handleAppError(400, '圖片網址錯誤', next);
    } else if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return handleAppError(400, '標籤為必填', next);
    }
    await Post.create({
      user: req.user,
      content: content.trim(),
      image: image,
      tags: tags,
    });
    handleResponse(res, 201, '新增成功');
  },
  async updatePost(req, res, next) {
    const { content, image, tags } = req.body;
    if (!content.trim()) {
      return handleAppError(400, '貼文內容為必填', next);
    } else if (image && !String(image).startsWith('http')) {
      return handleAppError(400, '圖片網址錯誤', next);
    } else if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return handleAppError(400, '標籤為必填', next);
    }
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return handleAppError(404, '查無此貼文 id', next);
    } else {
      await Post.findByIdAndUpdate(
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
      handleResponse(res, 201, '貼文更新成功');
    }
  },
  async deleteAllPost(req, res, next) {
    await Post.deleteMany({});
    handleResponse(res, 200, '全部刪除成功');
  },
  async deletePost(req, res, next) {
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return handleAppError(404, '查無此貼文 id', next);
    } else {
      await Post.findByIdAndDelete(req.params.id);
      handleResponse(res, 200, "刪除成功'");
    }
  },
};

module.exports = posts;
