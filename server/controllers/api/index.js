const router = require("express").Router();
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const registrationRoutes = require("./registrationRoutes");

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/registration", registrationRoutes);

module.exports = router;
