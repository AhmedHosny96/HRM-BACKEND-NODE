const express = require("express");
const multer = require("multer");
const path = require("path");
const validateObjectId = require("../middlewares/validateObjectId"); // validating req.param.id
const { Employee, Validate } = require("../models/employee");
const { Branch } = require("../models/branch");

const router = express();

// multer configurations

const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
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

//getting employees

router.get("/", async (req, res) => {
  const employees = await Employee.find().select("-__v");
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

  employee = new Employee({
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
    branch: {
      _id: branch._id,
      name: branch.name,
      city: branch.city,
      state: branch.state,
    },
    jobTitle: req.body.jobTitle,
    salary: req.body.salary,
    image: req.file.filename,
  });
  // saving data to db
  await employee.save();

  res.send(employee);
});

//updating employee records

router.put("/:id", async (req, res) => {
  //validate input fileds

  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // updating the employee records

  const branch = await Branch.findById(req.body.branchId);
  if (!branch) return res.status(404).send("Invalid branchId");

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      branch: {
        _id: branch._id,
        name: branch.name,
        city: branch.city,
        state: branch.state,
      },
      jobTitle: req.body.jobTitle,
      salary: req.body.salary,
    },
    { new: true }
  );

  res.send(employee);
});

//delete employee records

router.delete("/:id", validateObjectId, async (req, res) => {
  const employee = await Employee.findByIdAndRemove(req.param.id);
  res.send(employee);
});

module.exports = router;
