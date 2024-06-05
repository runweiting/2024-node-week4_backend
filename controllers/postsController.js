const {
  handleResponse,
  handleAppError,
} = require('../middlewares/handleResponses');
const Post = require('../models/postsModel');
const Comment = require('../models/commentsModel');
const Like = require('../models/likesModel');
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
        select: 'user',
      })
      .populate({
        path: 'comments',
        select: 'user comment createdAt',
      })
      .sort(timeSort);
    handleResponse(res, 200, '查詢成功', posts);
  },
  // 取得指定貼文
  async getPost(req, res, next) {
    const postId = req.params.id;
    const targetPost = await Post.findById(postId)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .populate({
        path: 'likes',
        select: 'user',
      })
      .populate({
        path: 'comments',
        select: 'user comment createdAt',
      });
    if (!targetPost) {
      return handleAppError(404, '查無此貼文 id');
    }
    handleResponse(res, 200, '查詢成功', targetPost);
  },
  // 取得指定用戶所有貼文 (用戶牆)
  async getUserPosts(req, res, next) {
    const userId = req.params.id;
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt';
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const query = {
      user: userId,
      ...q,
    };
    const posts = await Post.find(query)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .populate({
        path: 'likes',
        select: 'user',
      })
      .populate({
        path: 'comments',
        select: 'user comment createdAt',
      })
      .sort(timeSort);
    const targetUser = await User.findById(userId).select(
      'name photo followers',
    );
    if (posts.length === 0) {
      return handleAppError(404, '目前用戶沒有貼文', next);
    }
    if (!targetUser) {
      return handleAppError(404, '用戶不存在', next);
    }
    const newData = {
      targetUser,
      posts,
    };
    handleResponse(res, 200, '查詢成功', newData);
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
      user: req.user.id,
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
  async deletePost(req, res, next) {
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return handleAppError(404, '查無此貼文 id', next);
    }
    await Post.findByIdAndDelete(req.params.id);
    handleResponse(res, 200, "刪除成功'");
  },
  // 貼文按讚
  async likePost(req, res, next) {
    // 驗證是否有此貼文 id
    const targetPost = await Post.findById(req.params.id);
    if (!targetPost) {
      return handleAppError(404, '查無此貼文 id', next);
    }
    // upsert 是 updateOne 和 updateMany 的參數，用於更新操作時如查詢條件未匹配到任何文檔，則創建一個新的文檔
    await Like.updateOne(
      { post: req.params.id, user: req.user.id }, // 查詢
      { post: req.params.id, user: req.user.id }, // 更新
      { upsert: true }, // 新建
    );
    handleResponse(res, 200, '按讚成功');
  },
  // 取消指定貼文按讚
  async unlikePost(req, res, next) {
    const targetLike = await Like.findOneAndDelete({
      post: req.params.id,
      user: req.user.id,
    });
    if (!targetLike) {
      return handleAppError(404, '找不到按讚記錄', next);
    }
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
  async deleteAllPost(req, res, next) {
    await Post.deleteMany({});
    handleResponse(res, 200, '全部刪除成功');
  },
};

module.exports = posts;
