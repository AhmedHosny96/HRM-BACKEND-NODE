const router = require("express").Router();
const { User, validateUser } = require("../models/user");
const auth = require("../middlewares/auth");

// const sendMail = require("../utils/sendMail");
router.get("/", auth, async (req, res) => {
  const users = await User.find();
  res.send(users);
});
router.get("/admin", auth, async (req, res) => {
  const users = await User.find({ role: "Admin" });
  res.send(users);
});

router.get("/:id", auth, async (req, res) => {
  const users = await User.findById(req.params.id);
  res.send(users);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findById(req.params.id);

  user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  res.status(200).send(user);
});

router.delete("/:id", auth, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.send(user);
});

module.exports = router;
