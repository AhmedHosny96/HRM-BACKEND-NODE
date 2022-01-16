const mongoose = require("mongoose");
const Joi = require("joi-browser");
Joi.objectId = require("joi-objectid")(Joi);
Joi.image = require("joi-image-extension");
const { branchSchema } = require("./branch");
const { jobSchema } = require("./job");

// date extraction with out Time Zone

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
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
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  branch: {
    type: branchSchema,
    // required: true,
  },
  job: {
    type: jobSchema,
    // required: true,
  },
  salary: {
    type: Number,
    required: true,
  },

  startDate: {
    type: Date,
  },
  status: {
    type: String,
    default: "Active",
  },
  employmentStatus: {
    type: String,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

function validateEmployee(employee) {
  const schema = {
    employeeId: Joi.string().required(),
    fullName: Joi.string().required(),
    phoneNumber: Joi.number().required(),
    email: Joi.string().required().email(),
    gender: Joi.string(),
    branchId: Joi.objectId().required(), //validating branchId in the body of the req
    jobId: Joi.objectId().required(),
    status: Joi.string(),
    startDate: Joi.date(),
    employmentStatus: Joi.string(),
    salary: Joi.number().required(),
    // image: Joi.any().required(),
    branch: Joi.object(),
    job: Joi.object(),
    __v: Joi.number(),
  };

  return Joi.validate(employee, schema);
}

module.exports.employeeSchema = employeeSchema;
module.exports.Employee = Employee;
module.exports.Validate = validateEmployee;
