const mongoose = require('mongoose');
const commentsSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, '留言為必填'],
      trim: true,
    },
    // 引用 References
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, '貼文Id為必填'],
      index: true,
    },
    // 引用 References
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '用戶Id為必填'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
/* 1:many 寫法
步驟 2. 在參考 model 中使用 pre 中介函數
每次 find 都自動載入 user 欄位中對應的 User 資料
*/
commentsSchema.pre(/^find/, function (next, error) {
  if (error) {
    return next(error);
  }
  // this 指的是當前正在執行的 Query 物件，提供有關查詢的各種方法和屬性
  // 可用 this.limit(10) 限制返回的評論數量
  // 可用 this.sort({ createdAt: -1 }) 根據創建日期對評論進行排序
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;
