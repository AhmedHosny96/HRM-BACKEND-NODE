const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi-browser");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
  },
  email: {
    type: String,
    minlength: 8,
  },
  password: {
    type: String,
    minlength: 6,
  },
  isAdmin: Boolean,
});

//generating json web token  authentication
userSchema.methods.generateAuthToken = function () {
  //signing the token
  const token = jwt.sign(
    {
      _id: this.id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
//defining mode for user schema
const User = mongoose.model("user", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(4).required(),
    email: Joi.string().min(8).email().required(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.Validate = validateUser;
