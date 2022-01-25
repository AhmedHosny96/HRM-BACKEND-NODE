const mongoose = require("mongoose");
const Joi = require("joi-browser");
const { jobSchema } = require("./job");
const { branchSchema } = require("./branch");

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
    branchId: Joi.string().required().min(3),
    requiredNumber: Joi.number(),
    employementType: Joi.string().required(),
    details: Joi.string(),
    status: Joi.string(),
  };
  return Joi.validate(recruitment, schema);
}

module.exports = { Recruitment, validateRecruitment };
