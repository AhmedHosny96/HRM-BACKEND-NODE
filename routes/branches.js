const express = require("express");
const { Validate, Branch } = require("../models/branch");
const multer = require("multer");

const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const router = express.Router();

// getting all branches
router.get("/", auth, async (req, res) => {
  const branches = await Branch.find({}).sort({ name: 1 });
  res.send(branches);
});
//get active branches only

router.get("/open", auth, async (req, res) => {
  const branches = await Branch.find({ status: "Open" });
  res.send(branches);
});

router.get("/:id", auth, async (req, res) => {
  //find by id
  const branch = await Branch.findById(req.params.id);
  res.send(branch);
});

// creating new branch
router.post("/", auth, async (req, res) => {
  // validate the inputs
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if branch already exists

  let branch = await Branch.findOne({
    name: req.body.name,
  });
  if (branch) return res.status(400).send("Branch Already Exists");

  // create the new branch
  branch = new Branch({
    name: req.body.name,
    region: req.body.region,
    city: req.body.city,
  });
  await branch.save();

  res.send(branch);
});

//updating existing branches

router.put("/:id", auth, async (req, res) => {
  //validate
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if branch exists

  let branch = await Branch.findOne({
    name: req.body.name,
    region: req.body.region,
    city: req.body.city,
    status: req.body.status,
  });
  if (branch) return res.status(400).send("Branch Already Exist");

  // update
  branch = await Branch.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  // check if branch exists

  if (!branch) return res.status(404).send("Branch doesnt exist");
  // send the result
  res.send(branch);
});
// deleting a branch
router.delete("/:id", auth, async (req, res) => {
  // find the branch by id and remove
  const branch = await Branch.findByIdAndRemove(req.params.id);
  res.send(branch);
});

module.exports = router;
