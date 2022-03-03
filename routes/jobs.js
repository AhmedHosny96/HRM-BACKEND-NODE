const router = require("express").Router();
const { Job, Validate } = require("../models/job");
const validateId = require("../middlewares/validateObjectId");

const auth = require("../middlewares/auth");
router.get("/", auth, async (req, res) => {
  const jobs = await Job.find().sort({ name: 1 });
  res.send(jobs);
});

router.get("/:id", auth, async (req, res) => {
  const jobs = await Job.findById(req.params.id);
  res.send(jobs);
});

// adding new jobs
router.post("/", auth, async (req, res) => {
  //validate inputs
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if job already added
  let job = await Job.findOne({ name: req.body.name });
  if (job) return res.status(400).send("Job Already Added.");

  // create the new job
  job = new Job({
    code: req.body.code,
    name: req.body.name,
    department: req.body.department,
    description: req.body.description,
    qualification: req.body.qualification,
  });
  // save data to DB
  await job.save();
  // send the result
  res.send(job);
});

//updating existing job
router.put("/:id", auth, validateId, async (req, res) => {
  // validate
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update obj
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true } // so default values are overridden
  );

  res.send(job);
});

// deleting job

router.delete("/:id", auth, validateId, async (req, res) => {
  const job = await Job.findByIdAndRemove(req.params.id);
  res.send(job);
});

module.exports = router;
