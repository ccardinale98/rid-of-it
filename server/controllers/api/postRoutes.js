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

router.post("/create", async (req, res) => {
  console.log("POST /api/posts/create");

  try {
    const post = await Post.create({
      name: req.body.name,
      user_id: req.session.user_id,
      price: req.body.price,
      descriprion: req.body.description,
      image: req.body.image,
    });

    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
