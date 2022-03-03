const mongoose = require("mongoose");
// const Joi = require("joi-browser");

const medicalExpenseSchema = mongoose.Schema(
  {
    name: { type: String },
    allowedFor: [{ type: String }],
    allowedAmount: {
      type: Number,
    },
  },
  { timestamps: true },
  { collation: { locale: "en", strength: 2 } }
);

const MedicalExpense = mongoose.model("medicalExpense", medicalExpenseSchema);

module.exports = { MedicalExpense, medicalExpenseSchema };
