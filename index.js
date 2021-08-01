const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = 6000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

mongoose
  .connect("mongodb://localhost/HRM_DB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log("error occured", err);
  });
