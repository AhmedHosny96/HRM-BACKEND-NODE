const mongoose = require("mongoose");
const Joi = require("joi-browser");

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  region: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },
});

const Branch = mongoose.model("Branch", branchSchema);

function validateBranch(branch) {
  const schema = {
    name: Joi.string().required().min(3),
    region: Joi.string().required(),
    city: Joi.string().required().min(3),
    status: Joi.string().required().min(3),
  };
  return Joi.validate(branch, schema);
}
module.exports.branchSchema = branchSchema;
module.exports.Branch = Branch;
module.exports.Validate = validateBranch;
