const mongoose = require('mongoose');
const postsSchema = new mongoose.Schema(
  {
    // 引用 References
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '用戶Id為必填'],
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
    // 引用 References
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        unique: true, // 只能對貼文按讚一次
      },
    ],
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
    // 轉換為 JSON 格式時，包含 virtual 欄位
    toJSON: {
      virtuals: true,
    },
    // 轉換為 JavaScript 物件時，包含 virtual 欄位
    toObject: {
      virtuals: true,
    },
  },
);
/* 1:many 寫法
步驟 1. 在主要 model 中定義虛擬欄位 comments
建立 Post, Comment 的關連 */
postsSchema.virtual('comments', {
  ref: 'Comment', // 參考 model
  localField: '_id', // 主要 model 欄位
  foreignField: 'post', // 參考 model 欄位
});

const Post = mongoose.model('Post', postsSchema);

module.exports = Post;
