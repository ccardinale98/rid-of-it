const router = require("express").Router();
const { User } = require("../../models");

router.get("/", async (req, res) => {
  console.log("POST /api/registration/");

  if (req.session.logged_in == true) {
    return req.session.user_id;
  } else {
    return false;
  }
});

router.post("/login", async (req, res) => {
  console.log("POST /api/registration/login");

  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again." });
      return;
    }

    const validPassword = await user.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again." });
      return;
    }

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;

      res.json({ user: user, message: "Login Succesful" });
    });
  } catch (err) {
    res.status(404).end();
  }
});

router.post("/signup", async (req, res) => {
  console.log("POST /api/registration/signup");

  try {
    const user = await User.create({
      user_name: req.body.user_name,
      email: req.body.email,
      password: req.body.password,
      image: req.body.image,
    });

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;

      res.status(200).json(user);
    });
  } catch (err) {
    console.log(err);

    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  console.log("POST /api/registration/logout");

  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
