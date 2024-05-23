const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的匿稱'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['guest', 'member', 'admin'],
      default: 'guest',
    },
    email: {
      type: String,
      required: [true, '請輸入您的Email'],
      index: true,
      unique: true,
      lowercase: true,
      select: false,
      trim: true,
    },
    password: {
      type: String,
      required: [true, '請輸入您的密碼'],
      minlength: 8,
      select: false,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    photo: {
      type: String,
      default: '',
      trim: true,
    },
    googleId: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const User = mongoose.model('User', usersSchema);

module.exports = User;
