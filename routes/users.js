const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const { Employee } = require("../models/employee");
// const sendMail = require("../utils/sendMail");
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const users = await User.findById(req.params.id);
  res.send(users);
});

// create new user

//reset user password route

// router.post("/:id/:token", async (req, res) => {
//   //validate i.e only password is required
//   const schema = Joi.object({ password: Joi.string().min(6).required() });
//   // validate the body
//   const { error } = schema.validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);
//   // validate user
//   const user = await User.findById(req.params.id);
//   if (!user) return res.send("Invalid user or link expired");

//   // validate token
//   const token = await Token.findOne({
//     id: user._id,
//     token: req.params.token,
//   });

//   if (!token) return res.status(400).send("Invalid token ");
//   //get the new password from body
//   user.password = req.body.password;
//   // hash the password
//   const salt = await bcrypt.genSalt(10); //bcrypt returns promise therefore await
//   // hash the password using the salt
//   user.password = await bcrypt.hash(user.password, salt);
//   //save the new password with user obj
//   await user.save();
//   // after password reset delete the token
//   await token.delete();

//   res.send("password reset successfully");
// });

router.put("/", async (req, res) => {
  User.findByIdAndUpdate(req.params.id);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.send(user);
});

module.exports = router;
