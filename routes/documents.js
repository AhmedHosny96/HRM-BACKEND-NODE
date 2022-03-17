const multer = require("multer");
const path = require("path");
const router = require("express").Router();
const { Document, validateDocument } = require("../models/document");
const { Employee } = require("../models/employee");
const auth = require("../middlewares/auth");

// multer configuration for document upload
const uploadStorage = multer.diskStorage({
  // define destination
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../../hrm-react/public/employee_documents/")
    );
  },
  //define how filename will look like
  filename: function (req, file, cb) {
    console.log(req.body.employee);
    cb(
      null,
      req.body.employeeId +
        "_" +
        req.body.documentType +
        "_" +
        file.originalname
    );
  },
});

const uploads = multer({
  //storage
  storage: uploadStorage,
  //file limit
  limits: {
    fieldSize: 1024 * 1024 * 10,
  },
});

// getting all documents
router.get("/", async (req, res) => {
  const documents = await Document.find();
  res.send(documents);
});

//get documents by employee

router.get("/:employeeId", auth, async (req, res) => {
  const employeeId = await Employee.findById(req.params.employeeId);
  //find by id
  const documents = await Document.find({ "employee._id": employeeId });
  res.send(documents);
});

// creating new document
router.post("/", auth, uploads.single("attachment"), async (req, res) => {
  // validate the inputs
  const { error } = validateDocument(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if documents already exists

  let documents = await Document.findOne({
    "employee._id": req.body.employeeId,
    documentType: req.body.documentType,
  });
  if (documents)
    return res.status(400).send("Document exists for this employee");

  const employee = await Employee.findById(req.body.employeeId);
  if (!employee) return res.status(404).send("Invalid employee Id");

  // create the new documents
  documents = new Document({
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
    documentType: req.body.documentType,
    details: req.body.details,
    attachment: req.file.filename,
  });

  await documents.save();

  res.send(documents);
});

//updating existing documents

router.put("/:id", auth, async (req, res) => {
  //validate
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if document exists

  let documents = await Document.findOne({
    $set: req.body,
  });
  if (documents) return res.status(400).send("documents Already Exist");

  // update
  documents = await Document.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  // check if Document exists

  if (!documents) return res.status(404).send("document doesnt exist");
  // send the result
  res.send(documents);
});
// deleting a document
router.delete("/:id", auth, async (req, res) => {
  // find the document by id and remove
  const documents = await Document.findByIdAndRemove(req.params.id);
  res.send(documents);
});

module.exports = router;
