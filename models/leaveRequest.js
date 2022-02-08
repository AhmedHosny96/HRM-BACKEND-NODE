const mongoose = require("mongoose");
const Joi = require("joi-browser");
const { employeeSchema } = require("./employee");
const { leaveSchema } = require("./leave");

const oneDay = 24 * 60 * 60 * 1000;

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: { type: employeeSchema },
    leave: { type: leaveSchema },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    returnDate: {
      type: Date,
    },
    requestedDays: {
      type: Number,
    },
    takenDays: {
      type: Number,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { collation: { locale: "en", strength: 2 } },
  { timestamps: true }
);

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);

function validateRequest(leaveRequest) {
  const schema = {
    employeeId: Joi.string(),
    leaveId: Joi.string(),
    startDate: Joi.date(),
    returnDate: Joi.date(),

    // photo: Joi.string().required(),
  };
  return Joi.validate(leaveRequest, schema);
}

module.exports.leaveRequestSchema = leaveRequestSchema;
module.exports.LeaveRequest = LeaveRequest;
module.exports.validateRequest = validateRequest;
