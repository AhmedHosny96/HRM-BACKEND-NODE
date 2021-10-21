const express = require("express");
const multer = require("multer");
const path = require("path");
const { Photo, Validate } = require("../models/photo");
const router = express.Router();

const uploadStorage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({
  storage: uploadStorage,
  limits: {
    fieldSize: 1024 * 1024 * 4,
  },
});

router.post("/", uploads.single("photo"), async (req, res) => {
  //validate inputs
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if job already added
  let photo = await Photo.findOne({ photo: req.body.photo });
  if (photo) return res.status(400).send("photo Already Added.");

  // create the new photo
  photo = new Photo({
    name: req.body.name,
    department: req.body.department,
    photo: req.file.originalname,
  });
  // save data to DB
  await photo.save();
  // send the result
  res.send(photo);
});

module.exports = router;
