const router = require("express").Router();
const { validateLeave, LeaveTypes } = require("../models/leave");
const auth = require("../middlewares/auth");
// adding new jobs
router.post("/", auth, async (req, res) => {
  //validate inputs
  const { error } = validateLeave(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if job already added
  let leave = await LeaveTypes.findOne({ leaveType: req.body.leaveType });
  if (leave) return res.status(400).send("leave Already Added.");

  // create the new leave
  leave = new LeaveTypes({
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
router.put("/:id", auth, async (req, res) => {
  // validate
  const { error } = validateLeave(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update obj
  const leave = await LeaveTypes.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body, // so default values are overridden
    },
    { new: true }
  );

  res.send(leave);
});

router.delete("/:id", auth, async (req, res) => {
  const leave = await LeaveTypes.findByIdAndRemove(req.params.id);
  res.send(leave);
});

router.get("/", auth, async (req, res) => {
  const leaves = await LeaveTypes.find({}).sort({ leaveType: 1 });
  res.send(leaves);
});

router.get("/:id", auth, async (req, res) => {
  const leaves = await LeaveTypes.findById(req.params.id);
  res.send(leaves);
});

module.exports = router;
