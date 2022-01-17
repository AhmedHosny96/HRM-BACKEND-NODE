const mongoose = require("mongoose");
const Joi = require("joi-browser");
const { employeeSchema } = require("./employee");
const { medicalExpenseSchema } = require("./medicalExpense");

const medicalExpenseRequestSchema = mongoose.Schema(
  {
    medicalExpense: {
      type: medicalExpenseSchema,
    },
    employee: {
      type: employeeSchema,
    },
    patientName: {
      type: String,
    },
    gender: {
      type: String,
    },
    Age: {
      type: String,
    },
    relation: {
      type: String,
    },
    card: {
      type: Boolean,
      default: false,
    },
    prescription: {
      type: Boolean,
      default: false,
    },
    invoice: {
      type: Boolean,
      default: false,
    },
    medicalCertificate: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },

  { collation: { locale: "en", strength: 2 } },
  { timeStamp: true }
);

const MedicalExpenseRequest = mongoose.model(
  "medicalExpenseRequest",
  medicalExpenseRequestSchema
);

function validateRequest(medicalRequest) {
  const schema = {
    medicalExpenseId: Joi.string().required(),
    employeeId: Joi.string().required(),
    patientName: Joi.string().required(),
    gender: Joi.string(),
    age: Joi.number(),
    relation: Joi.string(),
    hospitalName: Joi.string().required(),
    location: Joi.string().required(),
    card: Joi.any(),
    prescription: Joi.any(),
    invoice: Joi.any(),
    medicalCertificate: Joi.any(),
    amount: Joi.number().required(),

    // photo: Joi.string().required(),
  };
  return Joi.validate(medicalRequest, schema);
}

module.exports = { MedicalExpenseRequest, validateRequest };
