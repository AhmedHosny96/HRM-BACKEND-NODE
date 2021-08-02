const express = require("express");
const { Validate, Branch } = require("../models/branch");
const router = express.Router();

// getting all branches
router.get("/", async (req, res) => {
  const branches = await Branch.find();
  res.send(branches);
});
//get branch

router.get("/:id", async (req, res) => {
  //find by id
  const branch = await Branch.findById(req.params.id);
  res.send(branch);
});

// creating new branch
router.post("/", async (req, res) => {
  // validate the inputs
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if branch already exists

  let branch = await Branch.findOne({ name: req.body.name });
  if (branch) return res.status(400).send("Branch Already Exists");

  // create the new branch
  branch = new Branch({
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
  });
  await branch.save();

  res.send(branch);
});

//updating existing branches

router.put("/:id", async (req, res) => {
  //validate
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // update
  const branch = await Branch.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      city: req.body.city,
      state: req.body.state,
    },
    { new: true }
  );
  // check if branch exists

  if (!branch) return res.send(404).send("Branch doesnt exist");
  // send the result
  res.send(branch);
});
// deleting a branch
router.delete("/:id", async (req, res) => {
  // find the branch by id and remove
  const branch = await Branch.findByIdAndRemove(req.params.id);
  res.send(branch);
});

module.exports = router;
