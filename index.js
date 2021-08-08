const express = require("express");
const config = require("config");
const winston = require("winston");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

// logging requests in the console
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.status < 400 + res.statusMessage;
    },
  })
);

app.use(bodyParser.json());

require("./startup/logging")();
require("./startup/db")();
require("./startup/config")();
require("./startup/routes")(app);

const port = process.env.PORT || 5000;

if (!config.get("jwtPrivateKey"))
  console.log("FATAL ERROR : jwtPrivateKey is not defined");

const server = app.listen(port, () => {
  winston.info(`listening on port ${port}`);
});

module.exports = server;
