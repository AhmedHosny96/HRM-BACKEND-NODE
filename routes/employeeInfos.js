const router = require("express").Router();

const { Employee } = require("../models/employee");
const {
  EmployeeInfo,
  validateEmployeeInfo,
} = require("../models/employeeInfo");

router.post("/", async (req, res) => {
  // validate the inputs
  const { error } = validateEmployeeInfo(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let employee = await Employee.findById(req.body.employeeId);
  if (!employee) return res.status(404).send("Invalid employee Id");

  let employeeInfo = await EmployeeInfo.findOne({
    _id: req.body.employeeId,
  });

  if (employeeInfo) return res.status(400).send("employee record exists");
  // create the new leaveRequest
  employeeInfo = new EmployeeInfo({
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

    maritalStatus: req.body.maritalStatus,
    spouseName: req.body.spouseName,
    children: req.body.children,
    contactPersonName: req.body.contactPersonName,
    contactPersonPhone: req.body.contactPersonPhone,

    // takenDays: takenDays,
  });

  await employeeInfo.save();

  res.send(employeeInfo);
});
//updating existing leave
router.put("/:id", async (req, res) => {
  // validate
  const { error } = validateEmployeeInfo(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update obj
  const leaveRequest = await EmployeeInfo.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body, // so default values are overridden
    },
    { new: true }
  );

  res.send(leaveRequest);
});

router.delete("/:id", async (req, res) => {
  const employeeInfo = await EmployeeInfo.findByIdAndRemove(req.params.id);
  res.send(employeeInfo);
});

// getting all leaveRequest
router.get("/", async (req, res) => {
  const employeeInfo = await EmployeeInfo.find();
  res.send(employeeInfo);
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
