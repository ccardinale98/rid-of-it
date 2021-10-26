const router = require("express").Router();
const { User } = require("../../models");

router.get("/", async (req, res) => {
  console.log("GET /api/users/");

  try {
    const user = await User.findAll();

    const users = user.map((user) => user.get({ plain: true }));
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  console.log("GET /api/user/:id");

  try {
    const user = await User.findByPk(req.params.id, {});

    if (!user) {
      res.status(404).json({ message: "No User with this ID" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/update/:id", async (req, res) => {
  console.log("PUT /api/users/update/:id");

  try {
    const user = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
