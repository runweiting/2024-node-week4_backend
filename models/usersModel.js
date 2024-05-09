const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的匿稱'],
    },
    email: {
      type: String,
      required: [true, '請輸入您的Email'],
      unique: true,
      lowercase: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, '請輸入您的密碼'],
      minlength: 8,
      select: false,
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);
const User = mongoose.model('User', usersSchema);

module.exports = User;
