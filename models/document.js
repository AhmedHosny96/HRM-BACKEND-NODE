const mongoose = require("mongoose");
const Joi = require("joi-browser");
const { employeeSchema } = require("./employee");

const documentSchema = new mongoose.Schema(
  {
    employee: { type: employeeSchema },
    documentType: {
      type: String,
    },
    addedDate: {
      type: Date,
    },
    details: {
      type: String,
    },
    attachment: { type: String, data: Buffer },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

function validateDocument(document) {
  const schema = {
    employeeId: Joi.string().required().min(2),
    documentType: Joi.string().required().min(2),
    addedDate: Joi.date().required(),
    details: Joi.string().required(),
    attachment: Joi.any(),
  };
  return Joi.validate(document, schema);
}

module.exports = { Document, validateDocument };
