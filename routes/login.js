const express = require("express");
const Joi = require("joi-browser");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const router = express.Router();

// getting currently logged in user

router.get("/me", async (req, res) => {
  const user = await User.findById(req.body._id).select("-password"); // exclude the password so itsnot exposed in the response
  res.send(user);
});

router.post("/", async (req, res) => {
  // validate
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //check if user email is correct
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Username or Password");
  //check if password in req = password in db
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid Username or Password");

  // generate auth token and return the token
  const token = user.generateAuthToken();
  res.send(token);
});

function validate(user) {
  const schema = {
    email: Joi.string().min(8).required().email(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(user, schema);
}

module.exports = router;
