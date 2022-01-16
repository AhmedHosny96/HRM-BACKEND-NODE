const mongoose = require("mongoose");
const Joi = require("joi-browser");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
    },
    region: {
      type: String,
    },
    city: {
      type: String,
    },

    status: {
      type: String,
      default: "Open",
    },
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", branchSchema);

function validateBranch(branch) {
  const schema = {
    name: Joi.string().required().min(3),
    region: Joi.string(),
    city: Joi.string().required().min(3),
    status: Joi.string().required().min(3),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
  };
  return Joi.validate(branch, schema);
}
module.exports.branchSchema = branchSchema;
module.exports.Branch = Branch;
module.exports.Validate = validateBranch;
