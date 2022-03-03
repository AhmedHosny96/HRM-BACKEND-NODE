const mongoose = require("mongoose");
const Joi = require("joi-browser");
const leaveSchema = new mongoose.Schema(
  {
    leaveType: { type: String },
    numberOfDays: {
      type: Number,
    },
    leaveGroup: {
      type: String,
    },
    // expirationDate: {
    //   type: Date,
    //   default: new Date().setFullYear(new Date().getFullYear() + 1, 0, 1),
    // },
  },
  { timestamps: true }
);

const LeaveTypes = mongoose.model("LeaveTypes", leaveSchema);

function validateLeave(leave) {
  const schema = {
    leaveType: Joi.string().required(),
    numberOfDays: Joi.number().required(),
    leaveGroup: Joi.string().required(),
  };
  return Joi.validate(leave, schema);
}

module.exports = { leaveSchema, LeaveTypes, validateLeave };
