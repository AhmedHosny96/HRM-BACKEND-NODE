const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, Validate } = require("../models/user");

router.get("/aaaa", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// create new user

router.post("/", async (req, res) => {
  //validate inputs
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User Already exists");
  // create user object by picking using lodash
  user = User(_.pick(req.body, ["name", "email", "password"]));
  // salt the password using bcrypt
  const salt = await bcrypt.genSalt(10); //bcrypt returns promise therefore await
  // hash the password using the salt
  user.password = await bcrypt.hash(user.password, salt);
  // save the user to db
  await user.save();
  // generate the auth token
  const token = user.generateAuthToken();
  // setting the response headers
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
