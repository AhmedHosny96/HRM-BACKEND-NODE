const mongoose = require("mongoose");
const Joi = require("joi-browser");

const Job = mongoose.model(
  "Job",
  new mongoose.Schema({
    title: {
      type: String,
      minlength: 2,
      maxlength: 255,
      required: true,
      trim: true,
    },
  })
);

function validateJob(job) {
  const schema = {
    title: Joi.string().required(),
  };
  return Joi.validate(job, schema);
}

module.exports.Job = Job;
module.exports.Validate = validateJob;
