var express = require("express");
var router = express.Router();
const PostsController = require("../controllers/posts");

router.get("/", PostsController.getPosts);
router.post("/", PostsController.createPost);
router.patch("/", PostsController.updatePost);
router.delete("/", PostsController.deleteAllPost);
router.delete("/:id", PostsController.deletePost);
router.options("/", async function (req, res, next) {
  res.status(200);
});

module.exports = router;
