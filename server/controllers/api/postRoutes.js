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
      description: req.body.description,
      image: req.body.image,
      tags: req.body.tags,
    });

    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  console.log("DELETE /api/posts/delete/:id");

  try {
    const post = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!post) {
      res.status(404).json({
        message: "No post found with this id!",
      });
      return;
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  console.log("GET /api/posts/:id");

  try {
    const post = await Post.findByPk(req.params.id, {});

    if (!post) {
      res.status(404).json({ message: "No post with this ID" });
      return;
    }

    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
