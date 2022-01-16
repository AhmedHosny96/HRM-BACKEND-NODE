const mongoose = require("mongoose");
const Joi = require("joi-browser");

const jobSchema = new mongoose.Schema(
  {
    code: { type: String },
    name: {
      type: String,
      minlength: 2,
      // maxlength: 255,
      required: true,
    },
    department: {
      type: String,
      minlength: 2,
      // maxlength: 255,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

function validateJob(job) {
  const schema = {
    code: Joi.string().required().min(2),
    name: Joi.string().required().min(2),
    department: Joi.string().required(),
    // photo: Joi.string().required(),
  };
  return Joi.validate(job, schema);
}

module.exports.jobSchema = jobSchema;
module.exports.Job = Job;
module.exports.Validate = validateJob;
