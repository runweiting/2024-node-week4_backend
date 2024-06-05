const mongoose = require('mongoose');
const likesSchema = new mongoose.Schema(
  {
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
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
// 設置複合唯一索引，確保每個 user 對每個 post 只能按一次讚
likesSchema.index({ post: 1, user: 1 }, { unique: true });
/* 1:many 寫法
步驟 2. 在參考 model 中使用 pre 中介函數
每次 find 都自動載入 user 欄位中對應的 User 資料
*/
likesSchema.pre(/^find/, function (next, error) {
  if (error) {
    return next(error);
  }
  // this 指的是當前正在執行的 Query 物件，提供有關查詢的各種方法和屬性
  // 可用 this.limit(10) 限制返回的評論數量
  // 可用 this.sort({ createdAt: -1 }) 根據創建日期對評論進行排序
  this.populate({
    path: 'user',
    select: 'name photo',
  }).sort('-createdAt');
  next();
});
const Like = mongoose.model('Like', likesSchema);

module.exports = Like;
