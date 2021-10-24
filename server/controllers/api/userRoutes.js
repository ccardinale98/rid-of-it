const router = require("express").Router();
const { User } = require("../../models");

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

module.exports = router;
