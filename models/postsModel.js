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
    // 轉換為 JSON 格式時
    toJSON: {
      // 包含 virtual 欄位
      virtuals: true,
      // transform 將 _id 替換為 id
      transform: (doc, ret) => {
        // ret 代表 Mongoose document 的 JSON 或物件格式
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    // 轉換為 JavaScript 物件時
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);
/* 1:many 寫法
步驟 1. 在主要 model 中定義虛擬欄位
建立 Post 和其他 model 的關連 */
postsSchema.virtual('comments', {
  ref: 'Comment', // 參考 model
  localField: '_id', // Post 中的欄位
  foreignField: 'post', // Comment 中欄位
});
postsSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id', // Post 中的欄位
  foreignField: 'post', // Like 中的欄位
});

const Post = mongoose.model('Post', postsSchema);

module.exports = Post;
