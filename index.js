const express = require("express");
const config = require("config");

const winston = require("winston");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

require("dotenv").config();

// logging requests in the console
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.status < 400;
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
