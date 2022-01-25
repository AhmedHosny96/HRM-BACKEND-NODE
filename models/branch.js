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
    status: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    __v: Joi.number(),
  };
  return Joi.validate(branch, schema);
}
module.exports = { Branch, branchSchema };
module.exports.Validate = validateBranch;
