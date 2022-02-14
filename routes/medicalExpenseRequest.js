const router = require("express").Router();
const { MedicalExpense } = require("../models/medicalExpense");
const { Employee } = require("../models/employee");

const {
  MedicalExpenseRequest,
  validateRequest,
} = require("../models/medicalExpenseRequest");

router.post("/", async (req, res) => {
  // validate the inputs
  const { error } = validateRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId);
  if (!employee) return res.status(404).send("Invalid employee Id");

  const medicalExpense = await MedicalExpense.findById(
    req.body.medicalExpenseId
  );
  if (!medicalExpense) return res.status(404).send("Invalid medical claim");

  // check if leaveRequest already exists
  let medicalExpenseRequest = await MedicalExpenseRequest.findOne({
    "employee._id": req.body.employeeId,
    "medicalExpense._id": req.body.medicalExpenseId,
    status: "Pending",
  });
  if (medicalExpenseRequest)
    return res
      .status(400)
      .send("Oops there is pending medical request for this employee!");

  // this blocks the employee to request more than the limit at once
  if (req.body.amount > medicalExpense.allowedAmount)
    return res
      .status(400)
      .send(
        `Sorry can't request more than ${medicalExpense.allowedAmount} ETB`
      );

  // keep tracks of each employee request

  // currenEmployee

  let currentEmployee = await Employee.findById(req.body.employeeId);

  let taken;

  const coveredExpense = await MedicalExpenseRequest.aggregate([
    // { $match: { _id: { $eq: req.body.employeeId } } },
    {
      $group: {
        _id: "$employee._id",
        totalTaken: { $sum: "$amount" },
      },
    },
  ]);

  coveredExpense.filter((expense) => {
    taken = expense.totalTaken;
    // console.log(currentEmployee._id);
  });

  const employeeMedicalExp = await MedicalExpenseRequest.findOne({
    "employee._id": req.body.employeeId,
  });

  console.log(employeeMedicalExp);

  medicalExpenseRequest = new MedicalExpenseRequest({
    medicalExpense: {
      _id: medicalExpense._id,
      name: medicalExpense.name,
      allowedFor: medicalExpense.allowedFor,
      allowedAmount: medicalExpense.allowedAmount,
    },
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

    patient: req.body.patient,
    name: req.body.name,
    gender: req.body.gender,
    age: req.body.age,
    hospitalName: req.body.hospitalName,
    location: req.body.location,
    card: req.body.card,
    prescription: req.body.prescription,
    invoice: req.body.invoice,
    medicalCertificate: req.body.medicalCertificate,
    amount: req.body.amount,
    taken: taken,
  });

  await medicalExpenseRequest.save();

  res.send(medicalExpenseRequest);
});
//updating existing leave
router.put("/:id", async (req, res) => {
  // validate
  const { error } = validateRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update obj
  const medicalExpenseRequest = await MedicalExpenseRequest.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body, // so default values are overridden
    },
    { new: true }
  );

  res.send(medicalExpenseRequest);
});

router.delete("/:id", async (req, res) => {
  const medicalExpenseRequest = await MedicalExpenseRequest.findByIdAndRemove(
    req.params.id
  );
  res.send(medicalExpenseRequest);
});

// getting all leaveRequest
router.get("/", async (req, res) => {
  const medicalExpenseRequest = await MedicalExpenseRequest.find();
  res.send(medicalExpenseRequest);
});

//get pending leaveRequests
router.get("/status", async (req, res) => {
  const medicalExpenseRequest = await MedicalExpenseRequest.find({
    status: "pending",
  });
  //find by id
  res.send(medicalExpenseRequest);
});

//get medicalExpense requests

router.get("/:employeeId", async (req, res) => {
  const employeeId = await Employee.findById(req.params.employeeId);
  //find by id
  const medicalExpenseRequest = await MedicalExpenseRequest.find({
    "employee._id": employeeId,
  });
  res.send(medicalExpenseRequest);
});
module.exports = router;
