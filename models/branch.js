const mongoose = require("mongoose");
const Joi = require("joi-browser");

const branchSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  city: {
    type: String,
    required: true,
    minlength: 4,
  },
  state: {
    type: String,
    required: true,
    minlength: 2,
  },
});

const Branch = mongoose.model("Branch", branchSchema);

function validateBranch(branch) {
  const schema = {
    name: Joi.string().required().min(3),
    city: Joi.string().required().min(3),
    state: Joi.string().required().min(2),
  };
  return Joi.validate(branch, schema);
}
module.exports.branchSchema = branchSchema;
module.exports.Branch = Branch;
module.exports.Validate = validateBranch;
