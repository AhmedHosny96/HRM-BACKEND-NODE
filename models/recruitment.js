const mongoose = require("mongoose");
const Joi = require("joi-browser");
const { jobSchema } = require("./job");
const { branchSchema } = require("./branch");
const { join } = require("lodash");

const recruitmentSchema = new mongoose.Schema(
  {
    job: {
      type: jobSchema,
      required: true,
    },
    branch: {
      type: branchSchema,
      required: true,
    },
    requiredNumber: {
      type: Number,
    },

    employementType: {
      type: String,
    },
    department: {
      type: String,
    },
    jobDescription: {
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
    branchId: Joi.string().required().min(3),
    requiredNumber: Joi.number(),
    employementType: Joi.string().required(),
    jobDescription: Joi.string(),
    status: Joi.string(),
    job: Joi.object(),
    branch: Joi.object(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    __v: Joi.number(),
  };
  return Joi.validate(recruitment, schema);
}

module.exports = { Recruitment, validateRecruitment };
