const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "請輸入您的名字"],
  },
  email: {
    type: String,
    required: [true, "請輸入您的Email"],
    unique: true,
    lowercase: true,
    select: false,
  },
  photo: String,
});
const User = mongoose.model("User", usersSchema);

module.exports = User;
