const express = require("express");
const validateObjectId = require("../middlewares/validateObjectId"); // validating req.param.id
const { Employee, Validate } = require("../models/employee");
const { Branch } = require("../models/branch");
const { Job } = require("../models/job");
const auth = require("../middlewares/auth");
const router = express();

//getting employees

router.get("/", auth, async (req, res) => {
  const employees = await Employee.find();
  res.send(employees);
});

router.get("/active", async (req, res) => {
  const employees = await Employee.find({ status: "Active" });
  res.send(employees);
});

//getting employee

router.get("/:id", auth, validateObjectId, async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.send(employee);
});

// creating new employee

router.post("/", auth, async (req, res) => {
  // validate inputs
  // const { error } = Validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  // check if employee already exists in the db
  let idTaken = await Employee.findOne({
    employeeId: req.body.employeeId,
  });
  if (idTaken) return res.status(400).send("employee ID is taken ");

  let emailTaken = await Employee.findOne({
    email: req.body.email,
  });
  if (emailTaken) return res.status(400).send("email is taken ");

  let phoneNumberTaken = await Employee.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  if (phoneNumberTaken) return res.status(400).send("phone number is taken ");
  //validate if the branchID is valid

  const branch = await Branch.findById(req.body.branchId);
  if (!branch) return res.status(404).send("Invalid Branch ");

  //validate job Id
  const job = await Job.findById(req.body.jobId);
  if (!job) return res.status(404).send("Invalid Job Id");

  employee = new Employee({
    // $set: req.body,
    employeeId: req.body.employeeId,
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    gender: req.body.gender,

    branch: {
      _id: branch._id,
      name: branch.name,
      city: branch.city,
      state: branch.state,
    },
    job: {
      _id: job._id,
      code: job.code,
      name: job.name,
      department: job.department,
    },
    salary: req.body.salary,
    status: req.body.status,
    startDate: req.body.startDate,
    employmentStatus: req.body.employmentStatus,
    term: req.body.term,
    expirationDate: req.body.expirationDate,
  });
  // saving data to db
  await employee.save();

  res.send(employee);
});

//updating employee records

router.put("/:id", auth, async (req, res) => {
  //validate input fileds

  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // updating the employee records

  const branch = await Branch.findById(req.body.branchId);
  if (!branch) return res.status(404).send("Invalid branch");

  const job = await Job.findById(req.body.jobId);
  if (!job) return res.status(404).send("Invalid job");

  // query options

  let employee = await Employee.findOne({
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    // branch: {
    //   status: branch.status,
    //   _id: branch._id,
    //   name: branch.name,
    //   region: branch.region,
    //   state: branch.state,
    // },
    // job: {
    //   _id: job._id,
    //   code: job.code,
    //   name: job.name,
    //   department: job.department,
    // },
    salary: req.body.salary,
    startDate: req.body.startDate,
    gender: req.body.gender,
    status: req.body.status,
    employmentStatus: req.body.employmentStatus,
    jobExitAttachment: req.body.jobExitAttachment,
  });

  if (employee) return res.status(400).send("Employee already registered");

  employee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      // $set: req.body,
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      branch: {
        _id: branch._id,
        name: branch.name,
        region: branch.region,
        state: branch.state,
      },
      job: {
        _id: job._id,
        name: job.name,
        department: job.department,
      },
      salary: req.body.salary,
      startDate: req.body.startDate,
      gender: req.body.gender,
      status: req.body.status,
      employmentStatus: req.body.employmentStatus,
    },
    { new: true }
  );
  if (!employee) return res.status(404).send("employee doesnt exist");

  res.send(employee);
});

//delete employee records

router.delete("/:id", async (req, res) => {
  const employee = await Employee.findByIdAndRemove(req.params.id);
  res.send(employee);
});

// get employees by branchid

router.get("/branch/:branchId", async (req, res) => {
  const branchId = await Branch.findById(req.params.branchId);
  const employee = await Employee.find({ "branch._id": branchId });
  res.send(employee);
});

module.exports = router;
