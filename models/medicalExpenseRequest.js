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
    patient: {
      type: String,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
    age: {
      type: String,
    },
    hospitalName: {
      type: String,
    },
    location: {
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
    taken: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },

  { collation: { locale: "en", strength: 2 } }
);

const MedicalExpenseRequest = mongoose.model(
  "medicalExpenseRequest",
  medicalExpenseRequestSchema
);

function validateRequest(medicalRequest) {
  const schema = {
    medicalExpenseId: Joi.string(),
    employeeId: Joi.string(),
    patient: Joi.string().required(),
    name: Joi.string(),
    gender: Joi.string(),
    age: Joi.number(),
    hospitalName: Joi.string().required(),
    location: Joi.string().required(),
    card: Joi.any(),
    prescription: Joi.any(),
    invoice: Joi.any(),
    medicalCertificate: Joi.any(),
    amount: Joi.number().required(),
    taken: Joi.number(),
    status: Joi.string(),
    medicalExpense: Joi.object(),
    employee: Joi.object(),
    __v: Joi.number(),
    // photo: Joi.string().required(),
  };
  return Joi.validate(medicalRequest, schema);
}

module.exports = { MedicalExpenseRequest, validateRequest };
