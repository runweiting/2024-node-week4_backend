const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema(
  {
    timestamp: {
      type: String,
      default: () => Math.floor(Date.now() / 1000).toString(),
    },
    merchantOrderNo: {
      type: String,
      unique: true,
    },
    amt: {
      type: Number,
      required: [true, '商品描述為必填'],
    },
    itemDesc: {
      type: String,
      required: [true, '商品描述為必填'],
      trim: true,
    },
    orderEmail: {
      type: String,
      required: [true, '訂購Email為必填'],
      trim: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
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
// 自動生成 merchantOrderNo
let dailyOrderCount = 0;
ordersSchema.pre('save', function (next) {
  if (!this.merchantOrderNo) {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    dailyOrderCount += 1;
    this.merchantOrderNo = `ORD${date}_ABC_${dailyOrderCount
      .toString()
      .padStart(4, '0')}`;
  }
  next();
});
// 添加索引
ordersSchema.index({ user: 1 });
ordersSchema.index({ merchantOrderNo: 1 });

const Order = mongoose.model('Order', ordersSchema);
module.exports = Order;