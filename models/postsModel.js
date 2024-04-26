const mongoose = require("mongoose");
const postsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: [true, "內容為必填"],
    },
    image: {
      type: String,
      default: "",
    },
    likes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);
const Post = mongoose.model("Post", postsSchema);

module.exports = Post;
