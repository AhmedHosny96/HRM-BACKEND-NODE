const router = require("express").Router();
const { Leave, validateLeave } = require("../models/leave");

router.get("/", async (req, res) => {
  const leaves = await Leave.find();
  res.send(leaves);
});

router.get("/:id", async (req, res) => {
  const leaves = await Leave.findById(req.params.id);
  res.send(leaves);
});

// adding new jobs
router.post("/", async (req, res) => {
  //validate inputs
  const { error } = validateLeave(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if job already added
  let leave = await Leave.findOne({ leaveType: req.body.leaveType });
  if (leave) return res.status(400).send("leave Already Added.");

  // create the new leave
  leave = new Leave({
    leaveType: req.body.leaveType,
    numberOfDays: req.body.numberOfDays,
    leaveGroup: req.body.leaveGroup,
  });
  // save data to DB
  await leave.save();
  // send the result
  res.send(leave);
});

//updating existing leave
router.put("/:id", async (req, res) => {
  // validate
  const { error } = validateLeave(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update obj
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body, // so default values are overridden
    },
    { new: true }
  );

  res.send(leave);
});

router.delete("/:id", async (req, res) => {
  const leave = await Leave.findByIdAndRemove(req.params.id);
  res.send(leave);
});

module.exports = router;
