const Joi = require("joi-browser");
Joi.ObjectId = require("joi-objectid")(Joi);
const { ObjectID } = require("mongodb");

const mongoose = require("mongoose");

const leaveTypesSchema = new mongoose.Schema(["anualLeave" , ]);
//   {
//     //anual leave
//     anualLeave: {
//       id: { type: ObjectID, default: ObjectID },
//       noOfDays: { type: Number },
//     },
//     //maternity leave
//     maternityLeave: {
//       id: { type: ObjectID, default: ObjectID },
//       noOfDays: { type: Number },
//     },
//     //paternity leave
//     paternityLeave: {
//       id: { type: ObjectID, default: ObjectID },
//       noOfDays: { type: Number },
//     },
//     // mourning leave
//     mourningLeave: {
//       id: { type: ObjectID, default: ObjectID },
//       noOfDays: { type: Number },
//     },
//   },
// ]);

const leaveTypes = mongoose.model("LeaveTypes", leaveTypesSchema);

function validateLeaveType(leave) {
  const schema = {
    anualLeave: Joi.object({
      id: Joi.ObjectId(),
      noOfDays: Joi.number().required(),
    }).required(),
    maternityLeave: Joi.object({
      id: Joi.ObjectId(),
      noOfDays: Joi.number().required(),
    }).required(),

    paternityLeave: Joi.object({
      id: Joi.ObjectId(),
      noOfDays: Joi.number().required(),
    }).required(),
    mourningLeave: Joi.object({
      id: Joi.ObjectId(),
      noOfDays: Joi.number().required(),
    }).required(),
  };
  return Joi.validate(leave, schema);
}

module.exports.LeaveType = leaveTypes;
module.exports.leaveTypesSchema = leaveTypesSchema;
module.exports.Validate = validateLeaveType;
