const router = require("express").Router();
const { MedicalExpense } = require("../models/medicalExpense");
// const validateId = require("../middlewares/validateObjectId");

router.get("/", async (req, res) => {
  const medicalExpense = await MedicalExpense.find();
  res.send(medicalExpense);
});

router.get("/:id", async (req, res) => {
  const medicalExpense = await MedicalExpense.findById(req.params.id);
  res.send(medicalExpense);
});

// adding new medicalExpense
router.post("/", async (req, res) => {
  //validate inputs
  //   const { error } = Validate(req.body);
  //   if (error) return res.status(400).send(error.details[0].message);

  //check if job already added
  let medicalExpense = await MedicalExpense.findOne({
    name: req.body.name,
  });
  if (medicalExpense)
    return res.status(400).send("medicalExpense Already Added.");

  // create the new job
  medicalExpense = new MedicalExpense({
    name: req.body.name,
    allowedFor: req.body.allowedFor,
    allowedAmount: req.body.allowedAmount,
  });
  // save data to DB
  await medicalExpense.save();
  // send the result
  res.send(medicalExpense);
});

//updating existing job
router.put("/:id", async (req, res) => {
  // validate
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update obj
  const medicalExpense = await MedicalExpense.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true } // so default values are overridden
  );

  res.send(medicalExpense);
});

// deleting job

router.delete("/:id", async (req, res) => {
  const medicalExpense = await MedicalExpense.findByIdAndRemove(req.params.id);
  res.send(medicalExpense);
});

module.exports = router;
