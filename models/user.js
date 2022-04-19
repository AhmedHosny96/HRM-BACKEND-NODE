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
    minlength: 3,
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
    enum: ["Not verified", "Active", "Deactivated"],
    default: "Not verified",
  },

  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "user",
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
      role: this.role,
      firstLogin: this.firstLogin,
      status: this.status,
      token: this.token,

      // userRole: this.userRole,
    },
    process.env.JWT_SEC,
    { expiresIn: "3d" }
  );
  return token;
};
//defining mode for user schema
const User = mongoose.model("user", userSchema);

function validateUser(user) {
  const schema = {
    employeeId: Joi.string(),
    username: Joi.string().min(4),
    email: Joi.string().min(10).email(),
    role: Joi.string(),
    status: Joi.string(),
  };
  return Joi.validate(user, schema);
}

module.exports = { validateUser, User };
