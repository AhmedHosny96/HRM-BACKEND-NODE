const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi-browser");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    required: true,
  },
  email: {
    type: String,
    minlength: 8,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  isAdmin: Boolean,
});

//generating json web token  authentication
userSchema.methods.generateAuthToken = function () {
  jwt.sign();
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
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(4).required(),
    email: Joi.string().min(8).required(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.Validate = validateUser;
