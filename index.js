const express = require("express");
const app = express();
const config = require("config");
const winston = require("winston");

require("./startup/logging")();
require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 5000;

if (!config.get("jwtPrivateKey"))
  console.log("FATAL ERROR : jwtPrivateKey is not defined");

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
