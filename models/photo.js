const mongoose = require("mongoose");
const Joi = require("joi-browser");

const photoSchema = new mongoose.Schema({

  photo: {
    type: String,
    // maxlength: 255,
    required: true,
  },
});

const Photo = mongoose.model("Photo", photoSchema);

function validatePhoto(photo) {
  const schema = {
    // photo: Joi.string().required().min(2),
    // photo: Joi.string().required(),
  };
  return Joi.validate(photo, schema);
}

module.exports.photoSchema = photoSchema;
module.exports.Photo = Photo;
module.exports.Validate = validatePhoto;
