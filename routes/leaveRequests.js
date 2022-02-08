const router = require("express").Router();
const { LeaveTypes } = require("../models/leave");
const { Employee } = require("../models/employee");

const { LeaveRequest, validateRequest } = require("../models/leaveRequest");

router.post("/", async (req, res) => {
  // validate the inputs
  const { error } = validateRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId);
  if (!employee) return res.status(404).send("Invalid employee Id");

  const leave = await LeaveTypes.findById(req.body.leaveId);
  if (!leave) return res.status(404).send("Invalid leave Id");

  // calculating days taken from startDate - return date
  let oneDay = 24 * 60 * 60 * 1000;

  var startDate = new Date(req.body.startDate);
  var returnDate = new Date(req.body.returnDate);

  const dateInNumber = Math.round(Math.abs((startDate - returnDate) / oneDay));

  // check if employee is requesting more than the allowed days

  // if (dateInNumber > leave.numberOfDays)
  //   return res
  //     .status(400)
  //     .send("you are requesting more than the allowed days");

  // calculate avaliable leave days for employee

  // check if leaveRequest already exists
  let leaveRequest = await LeaveRequest.findOne({
    "employee._id": req.body.employeeId,
    "leave._id": req.body.leaveId,
  });
  if (leaveRequest && leaveRequest.status !== "Approved")
    return res.status(400).send("Oops there is Pending leave request for you!");

  // takenDays = dateInNumber;
  // const requestedDaysFromDb = await LeaveRequest.find(
  //   {},
  //   { requestedDays: 1, _id: 0 }
  // );

  // console.log("TOTAL REQUEST" + requestedDaysFromDb);

  // if (requestedDaysFromDb) {
  //   takenDays = requestedDaysFromDb + dateInNumber;
  // }

  // create the new leaveRequest
  leaveRequest = new LeaveRequest({
    employee: {
      _id: employee._id,
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      phoneNumber: employee.phoneNumber,
      branch: {
        _id: employee.branch._id,
        status: employee.branch.status,
        name: employee.branch.name,
        city: employee.branch.city,
        region: employee.branch.region,
      },
      job: {
        _id: employee.job._id,
        code: employee.job.code,
        name: employee.job.name,
        department: employee.job.department,
      },

      email: employee.email,
      salary: employee.salary,
      status: employee.status,
      employmentStatus: employee.employmentStatus,
      gender: employee.gender,
    },
    leave: {
      _id: leave._id,
      leaveType: leave.leaveType,
      numberOfDays: leave.numberOfDays,
      leaveGroup: leave.leaveGroup,
    },
    startDate: req.body.startDate,
    returnDate: req.body.returnDate,
    // requestedDays: dateInNumber,
    // takenDays: takenDays,
  });

  await leaveRequest.save();

  res.send(leaveRequest);
});
//updating existing leave
router.put("/:id", async (req, res) => {
  // validate
  const { error } = validateRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update obj
  const leaveRequest = await LeaveRequest.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body, // so default values are overridden
    },
    { new: true }
  );

  res.send(leaveRequest);
});

router.delete("/:id", async (req, res) => {
  const leaveRequest = await LeaveRequest.findByIdAndRemove(req.params.id);
  res.send(leaveRequest);
});

// getting all leaveRequest
router.get("/", async (req, res) => {
  const leaveRequest = await LeaveRequest.find();
  res.send(leaveRequest);
});

//get pending leaveRequests
router.get("/status", async (req, res) => {
  const leaveRequest = await LeaveRequest.find({ status: "pending" });
  //find by id
  res.send(leaveRequest);
});

//get leaveRequest by employeeId

router.get("/:employeeId", async (req, res) => {
  const employeeId = await Employee.findById(req.params.employeeId);
  //find by id
  const leaveRequest = await LeaveRequest.find({ "employee._id": employeeId });
  res.send(leaveRequest);
});
module.exports = router;
