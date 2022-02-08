const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi-browser");
const { employeeSchema } = require("./employee");
require("dotenv");

const userSchema = new mongoose.Schema({
  employee: {
    type: employeeSchema,
  },
  username: {
    type: String,
    minlength: 5,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["Not verified", "Verified", "Deactivated"],
    default: "Not verified",
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  firstLogin: {
    type: Number,
    default: 0,
  },

  token: { type: String },
});

//generating json web token  authentication
userSchema.methods.generateAuthToken = function () {
  //signing the token
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
      email: this.email,
      isAdmin: this.isAdmin,
      firstLogin: this.firstLogin,
      status: this.status,

      // userRole: this.userRole,
    },
    process.env.JWT_SEC
  );
  return token;
};
//defining mode for user schema
const User = mongoose.model("user", userSchema);

function validateUser(user) {
  const schema = {
    employeeId: Joi.string().required(),
    username: Joi.string().min(4).required(),
    email: Joi.string().min(10).email().required(),
    password: Joi.string(),
  };
  return Joi.validate(user, schema);
}

module.exports = { validateUser, User };
