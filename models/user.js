const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi-browser");
require("dotenv");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
  },
  email: {
    type: String,
    minlength: 8,
  },
  phone: {
    type: String,
    minlength: 8,
  },
  userRole: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // isAdmin: Boolean,
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
});

//generating json web token  authentication
userSchema.methods.generateAuthToken = function () {
  //signing the token
  const token = jwt.sign(
    {
      _id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      userRole: this.userRole,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
//defining mode for user schema
const User = mongoose.model("user", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().min(10).email().required(),
    phone: Joi.number().required(),
    userRole: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.Validate = validateUser;
