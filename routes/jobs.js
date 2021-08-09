const express = require("express");
const { Job, Validate } = require("../models/job");
const validateId = require("../middlewares/validateObjectId");
const router = express.Router();

router.get("/", async (req, res) => {
  const jobs = await Job.find().select("-__v");
  res.send(jobs);
});

// adding new jobs
router.post("/", async (req, res) => {
  //validate inputs
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if job already added
  let job = await Job.findOne({ title: req.body.title });
  if (job) return res.status(400).send("Job Already Added.");

  // create the new job
  job = new Job({
    title: req.body.title,
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
      title: req.body.title,
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
