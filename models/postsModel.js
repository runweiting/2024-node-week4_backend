const mongoose = require('mongoose');
const postsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '用戶 Id 未填寫'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, '貼文內容為必填'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    comments: {
      type: Number,
      default: 0,
    },
    tags: {
      // 字串陣列
      type: [String],
      enum: ['音樂', '運動', '美食', '旅遊', '其他'],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const Post = mongoose.model('Post', postsSchema);

module.exports = Post;
