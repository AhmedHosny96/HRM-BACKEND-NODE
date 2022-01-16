const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi-browser");
const { employeeSchema } = require("./employee");
require("dotenv");

const userSchema = new mongoose.Schema(
  {
    employee: {
      type: employeeSchema,
    },
    username: {
      type: String,
      minlength: 5,
    },
    email: {
      type: String,
      minlength: 8,
    },
    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Deactivated"],
      default: "Pending",
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    isHrOfficer: {
      type: Boolean,
      default: false,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },

    token: { type: String, expires: 3600 },

    // verification
  },
  { timestamps: true }
);

//generating json web token  authentication
userSchema.methods.generateAuthToken = function () {
  //signing the token
  const token = jwt.sign(
    {
      _id: this.id,
      name: this.username,
      email: this.email,
      phone: this.phone,
      isAdmin: this.isAdmin,
      isHrOfficer: this.isHrOfficer,
      isStaff: this.isStaff,
      status: this.status,

      // userRole: this.userRole,
    },
    config.get("jwtPrivateKey")
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
    phone: Joi.number().required(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(user, schema);
}

module.exports = { validateUser, User };
