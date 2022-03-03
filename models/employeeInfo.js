const mongoose = require("mongoose");
const Joi = require("joi-browser");
const { employeeSchema } = require("./employee");

const employeeInfoSchema = new mongoose.Schema(
  {
    employee: { type: employeeSchema },
    maritalStatus: {
      type: String,
    },
    spouseName: {
      type: String,
    },
    children: {
      type: Number,
    },
    contactPersonName: {
      type: String,
    },
    contactPersonPhone: {
      type: String,
    },
  },
  { timestamps: true }
);

const EmployeeInfo = mongoose.model("EmployeeInfo", employeeInfoSchema);

function validateEmployeeInfo(employee) {
  const schema = {
    employeeId: Joi.string(),
    maritalStatus: Joi.string().required().min(2),
    spouseName: Joi.string().required(),
    children: Joi.number(),
    contactPersonName: Joi.string().required(),
    contactPersonPhone: Joi.string().required(),
  };
  return Joi.validate(employee, schema);
}

module.exports = { EmployeeInfo, validateEmployeeInfo };
