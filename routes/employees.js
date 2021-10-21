const express = require("express");
const multer = require("multer");
const path = require("path");
const moment = require("moment");

const validateObjectId = require("../middlewares/validateObjectId"); // validating req.param.id
const { Employee, Validate } = require("../models/employee");
const { Branch } = require("../models/branch");
const { Job } = require("../models/job");
const router = express();

// multer configurations

const uploadStorage = multer.diskStorage({
  // define destination
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  //define how filename will look like
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({
  //storage
  storage: uploadStorage,
  //file limit
  limits: {
    fieldSize: 1024 * 1024 * 4,
  },
});

//getting employees

router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.send(employees);
});

//getting employee

router.get("/:id", validateObjectId, async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.send(employee);
});

// creating new employee

router.post("/", uploads.single("image"), async (req, res) => {
  // validate inputs
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if employee already exists in the db

  let employee = await Employee.findOne({ fullName: req.body.fullName });
  if (employee) return res.status(400).send("Employee already registered");

  //validate if the branchID is valid

  const branch = await Branch.findById(req.body.branchId);
  if (!branch) return res.status(404).send("Invalid Branch ");

  //validate job Id
  const job = await Job.findById(req.body.jobId);
  if (!job) return res.status(404).send("Invalid Job Id");

  employee = new Employee({
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
      name: job.name,
      department: job.department,
    },
    salary: req.body.salary,
    image: req.file.originalname,
    status: req.body.status,
    startDate: req.body.startDate,
    employmentStatus: req.body.employmentStatus,
    // image2: req.file.filename,
    // image3: req.file.filename,
    // image3: req.file.filename,
  });
  // saving data to db
  await employee.save();

  res.send(employee);
});

//updating employee records

router.put("/:id", uploads.single("image"), async (req, res) => {
  //validate input fileds

  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // updating the employee records

  const branch = await Branch.findById(req.body.branchId);
  if (!branch) return res.status(404).send("Invalid branch");

  const job = await Job.findById(req.body.jobId);
  if (!job) return res.status(404).send("Invalid job");

  // query options

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,

      branch: {
        _id: branch._id,
        name: branch.name,
        city: branch.city,
        state: branch.state,
      },
      job: {
        _id: job._id,
        name: job.name,
        department: job.department,
      },
      salary: req.body.salary,
      // startDate: req.body.startDate,
      // gender: req.body.gender,
      // status: req.body.status,
      image: req.file.filename,
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

module.exports = router;
