const {
  handleResponse,
  handleAppError,
} = require('../middlewares/handleResponses');
const Post = require('../models/postsModel');
const Comment = require('../models/commentsModel');

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
      .populate({
        path: 'comments',
        select: 'user comment createdAt',
      })
      .sort(timeSort);
    handleResponse(res, 200, '查詢成功', posts);
  },
  async createPost(req, res, next) {
    const { content, image, tags } = req.body;
    if (!content.trim()) {
      return handleAppError(400, '貼文內容為必填', next);
    } else if (image && !String(image).startsWith('http')) {
      return handleAppError(400, '圖片格式錯誤', next);
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
      return handleAppError(400, '圖片格式錯誤', next);
    } else if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return handleAppError(400, '標籤為必填', next);
    }
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return handleAppError(404, '查無此貼文 id', next);
    }
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
    handleResponse(res, 201, '更新成功');
  },
  async deleteAllPost(req, res, next) {
    await Post.deleteMany({});
    handleResponse(res, 200, '全部刪除成功');
  },
  async deletePost(req, res, next) {
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return handleAppError(404, '查無此貼文 id', next);
    }
    await Post.findByIdAndDelete(req.params.id);
    handleResponse(res, 200, "刪除成功'");
  },
  // 取得指定貼文
  async getPost(req, res, next) {
    const postId = req.params.id;
    const targetPost = await Post.findById(postId);
    if (!targetPost) {
      return handleAppError(404, '查無此貼文 id');
    }
    handleResponse(res, 200, '查詢成功', targetPost);
  },
  // 取得指定用戶所有貼文 (用戶牆)
  async getUserPosts(req, res, next) {
    const userId = req.params.id;
    const postsList = await Post.find({ user: userId });
    if (postsList.length === 0) {
      return handleAppError(404, '目前用戶沒有貼文', next);
    }
    handleResponse(res, 200, '查詢成功', postsList);
  },
  // 貼文按讚
  async likePost(req, res, next) {
    // 驗證是否有此貼文 id
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return handleAppError(404, '查無此貼文 id', next);
    }
    await Post.findByIdAndUpdate(req.params.id, {
      // 在 likes 欄位加入此 req.user.id
      $addToSet: {
        likes: req.user.id,
      },
    });
    handleResponse(res, 200, '按讚成功');
  },
  // 取消指定貼文按讚
  async unlikePost(req, res, next) {
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return next(handleAppError(404, '查無此貼文 id', next));
    }
    await Post.findByIdAndUpdate(req.params.id, {
      // 在 likes 欄位移除此 req.user.id
      $pull: {
        likes: req.user.id,
      },
    });
    handleResponse(res, 200, '已取消按讚');
  },
  // 貼文留言
  async createComment(req, res, next) {
    const { comment } = req.body;
    if (!comment.trim()) {
      return handleAppError(400, '留言為必填', next);
    }
    const newComment = await Comment.create({
      comment: comment,
      post: req.params.id,
      user: req.user,
    });
    handleResponse(res, 201, '新增成功', newComment);
  },
  // 刪除指定貼文留言
  async deleteComment(req, res, next) {
    const targetComment = await Comment.findById(req.params.id);
    if (!targetComment) {
      return handleAppError(404, '查無此留言 id', next);
    }
    await Comment.findByIdAndDelete(req.params.id);
    handleResponse(res, 200, '刪除成功');
  },
};

module.exports = posts;
