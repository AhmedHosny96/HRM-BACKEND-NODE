const router = require("express").Router();
const { Recruitment, validateRecruitment } = require("../models/recruitment");
const { Job } = require("../models/job");

// getting all recruitments
router.get("/", async (req, res) => {
  const recruitment = await Recruitment.find();
  res.send(recruitment);
});
//get recruitement

router.get("/:id", async (req, res) => {
  //find by id
  const recruitment = await Recruitment.findById(req.params.id);
  res.send(recruitment);
});

// process recruitement request
router.post("/", async (req, res) => {
  // validate the inputs
  const { error } = validateRecruitment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if branch already exists

  let recruitment = await Recruitment.findOne({
    name: req.body.name,
  });
  if (recruitment) return res.status(400).send("recruitment Already Exists");

  const job = await Job.findById(req.body.jobId);
  if (!job) return res.status(404).send("Invalid Job Id");

  // create the new recruitment
  recruitment = new Recruitment({
    job: {
      _id: job._id,
      code: job.code,
      name: job.name,
      department: job.department,
    },
    requiredNumber: req.body.requiredNumber,
    experience: req.body.experience,
    employementType: req.body.employementType,
    department: req.body.department,
    details: req.body.details,
  });
  await recruitment.save();

  res.send(recruitment);
});

//updating existing recruitments

router.put("/:id", async (req, res) => {
  //validate
  const { error } = validateRecruitment(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if recruitment exists

  let recruitment = await Recruitment.findOne({
    name: req.body.name,
    region: req.body.region,
    city: req.body.city,
    status: req.body.status,
  });
  if (recruitment) return res.status(400).send("recruitment Already Exist");

  // update
  recruitment = await Recruitment.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  // check if recruitment exists

  if (!recruitment) return res.status(404).send("recruitment doesnt exist");
  // send the result
  res.send(recruitment);
});
// deleting a recruitment
router.delete("/:id", async (req, res) => {
  // find the recruitment by id and remove
  const recruitment = await Recruitment.findByIdAndRemove(req.params.id);
  res.send(recruitment);
});

module.exports = router;
