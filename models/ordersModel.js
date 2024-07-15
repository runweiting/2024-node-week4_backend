const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    merchantOrderNo: {
      type: String,
      unique: true,
    },
    amt: {
      type: Number,
      required: [true, '金額為必填'],
    },
    itemDesc: {
      type: String,
      required: [true, '商品描述為必填'],
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
    tradeInfo: {
      status: { type: String },
      message: { type: String },
      tradeNo: { type: String },
      ip: { type: String },
      escrowBank: { type: String },
      paymentType: { type: String },
      payTime: { type: Date },
      payerAccount5Code: { type: String },
      payBankCode: { type: String },
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
    this.merchantOrderNo = `ORD${date}_M_${dailyOrderCount
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
