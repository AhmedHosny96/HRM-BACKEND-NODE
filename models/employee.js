const mongoose = require("mongoose");
const Joi = require("joi-browser");
Joi.objectId = require("joi-objectid")(Joi);

const { branchSchema } = require("../models/branch");

const Employee = mongoose.model(
  "Employee",
  new mongoose.Schema({
    fullName: {
      type: String,
      minlength: 5,
      required: true,
    },
    phoneNumber: {
      type: Number,
      minlength: 9,
      required: true,
    },
    branch: {
      type: branchSchema,
      required: true,
    },
    jobTitle: {
      type: String,
      minlength: 5,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
  })
);

function validateEmployee(employee) {
  const schema = {
    fullName: Joi.string().required(),
    phoneNumber: Joi.number().required(),
    branchId: Joi.objectId().required(), //validating branchId in the body of the req
    jobTitle: Joi.string().required(),
    salary: Joi.number().required(),
  };

  return Joi.validate(employee, schema);
}

module.exports.Employee = Employee;
module.exports.Validate = validateEmployee;
