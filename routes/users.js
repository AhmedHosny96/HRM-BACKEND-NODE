const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, Validate } = require("../models/user");

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// create new user

router.post("/", async (req, res) => {
  //validate
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if user already exits
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User Already Registered");

  // create the user
  user = new User(_.pick(req.body, [("name", "email", "password")]));
  // salt the password
  const salt = await bcrypt.genSalt(10); // bcrypt is promise therefore await
  // hash the password with the salt
  user.password = await bcrypt.hash(user.password, salt);
  // save the user to db
  await user.save();
  //generate token

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id ", "name", "email"]));
});

module.exports = router;
