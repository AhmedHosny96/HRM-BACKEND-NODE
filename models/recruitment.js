const mongoose = require("mongoose");
const Joi = require("joi-browser");
const { jobSchema } = require("./job");

const recruitmentSchema = new mongoose.Schema(
  {
    job: {
      type: jobSchema,
      required: true,
    },
    requiredNumber: {
      type: Number,
    },
    experience: {
      type: String,
    },
    employementType: {
      type: String,
    },
    department: {
      type: String,
    },
    details: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Recruitment = mongoose.model("Recruitment", recruitmentSchema);

function validateRecruitment(recruitment) {
  const schema = {
    jobId: Joi.string().required().min(3),
    requiredNumber: Joi.number(),
    experience: Joi.string().required().min(3),
    employementType: Joi.string().required(),
    department: Joi.string().required(),
    details: Joi.string().required(),
  };
  return Joi.validate(recruitment, schema);
}

module.exports = { Recruitment, validateRecruitment };
