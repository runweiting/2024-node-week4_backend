const { handleSuccess, handleError } = require("../utilities/handler");
const Post = require("../models/postsModel");
const User = require("../models/usersModel");

const posts = {
  async getPosts(req, res) {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const posts = await Post.find(q)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(timeSort);
    handleSuccess(res, "查詢成功", posts);
  },
  async createPost(req, res) {
    try {
      const { body } = req;
      if (!body.content) {
        throw new Error("內容為必填");
      }
      const newPost = await Post.create({
        user: body.user,
        content: body.content.trim(),
        image: body.image,
        likes: body.likes,
      });
      handleSuccess(res, "新增成功", newPost);
    } catch (err) {
      handleError(res, err.message);
    }
  },
  async updatePost(req, res) {
    try {
      const { body } = req;
      const id = req.params.id;
      if (!body.content) {
        throw new Error("內容為必填");
      }
      const updatePost = await Post.findByIdAndUpdate(
        id,
        {
          user: body.user,
          content: body.content.trim(),
          image: body.image,
          likes: body.likes,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (updatePost !== null) {
        handleSuccess(res, "更新成功", updatePost);
      } else {
        throw new Error("查無此貼文 id");
      }
    } catch (err) {
      handleError(res, err.message);
    }
  },
  async deleteAllPost(req, res) {
    try {
      const route = req.originalUrl.split("?")[0];
      if (route === "/posts/") {
        throw new Error("請提供正確的貼文 id");
      } else {
        await Post.deleteMany({});
        handleSuccess(res, "全部刪除成功");
      }
    } catch (err) {
      handleError(res, err.message);
    }
  },
  async deletePost(req, res) {
    try {
      const id = req.params.id;
      const deletePost = await Post.findOneAndDelete(id);
      if (deletePost !== null) {
        handleSuccess(res, "刪除成功", deletePost);
      } else {
        throw new Error("查無此貼文 id");
      }
    } catch (err) {
      handleError(res, err.message);
    }
  },
};

module.exports = posts;
