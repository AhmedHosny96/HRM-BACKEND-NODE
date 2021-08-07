const express = require("express");
const config = require("config");
const app = express();
const winston = require("winston");

winston;

require("./startup/logging")();
require("./startup/db")();
require("./startup/config")();
require("./startup/routes")(app);

const port = process.env.PORT || 5000;

if (!config.get("jwtPrivateKey"))
  console.log("FATAL ERROR : jwtPrivateKey is not defined");

app.listen(port, () => {
  winston.info(`listening on port ${port}`);
});
