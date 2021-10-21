const express = require("express");
const multer = require("multer");
const path = require("path");
const { Job, Validate } = require("../models/job");
const validateId = require("../middlewares/validateObjectId");
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

router.get("/", async (req, res) => {
  const jobs = await Job.find();
  res.send(jobs);
});

router.get("/:id", async (req, res) => {
  const jobs = await Job.findById(req.params.id);
  res.send(jobs);
});

// adding new jobs
router.post("/", async (req, res) => {
  //validate inputs
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if job already added
  let job = await Job.findOne({ name: req.body.name });
  if (job) return res.status(400).send("Job Already Added.");

  // create the new job
  job = new Job({
    name: req.body.name,
    department: req.body.department,
  });
  // save data to DB
  await job.save();
  // send the result
  res.send(job);
});

//updating existing job
router.put("/:id", validateId, async (req, res) => {
  // validate
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update obj
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      department: req.body.department,
    },
    { new: true } // so default values are overridden
  );

  res.send(job);
});

// deleting job

router.delete("/:id", validateId, async (req, res) => {
  const job = await Job.findByIdAndRemove(req.params.id);
  res.send(job);
});

module.exports = router;
