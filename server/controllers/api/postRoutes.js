const router = require("express").Router();
const { Post } = require("../../models");

router.get("/", async (req, res) => {
  console.log("GET /api/posts/");

  try {
    const post = await Post.findAll();

    const posts = post.map((post) => post.get({ plain: true }));
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
