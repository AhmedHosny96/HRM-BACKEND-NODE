const router = require("express").Router();
const { User, validateUser } = require("../models/user");
const auth = require("../middlewares/auth");

// const sendMail = require("../utils/sendMail");
router.get("/", auth, async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/:id", auth, async (req, res) => {
  const users = await User.findById(req.params.id);
  res.send(users);
});

router.put("/", auth, async (req, res) => {
  User.findByIdAndUpdate(req.params.id);
});

router.delete("/:id", auth, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.send(user);
});

module.exports = router;
