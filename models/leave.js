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
    expirationDate: {
      type: Date,
      default: new Date().setFullYear(new Date().getFullYear() + 1, 0, 1),
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);

function validateLeave(leave) {
  const schema = {
    leaveType: Joi.string().required(),
    numberOfDays: Joi.number().required(),
    leaveGroup: Joi.string().required(),
    // photo: Joi.string().required(),
  };
  return Joi.validate(leave, schema);
}

module.exports.leaveSchema = leaveSchema;
module.exports.Leave = Leave;
module.exports.validateLeave = validateLeave;
