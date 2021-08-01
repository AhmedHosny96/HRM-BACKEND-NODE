const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("./startup/db")();

const port = process.env.PORT || 6000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
