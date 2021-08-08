const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");

module.exports = function () {
  // get db env varaible from default.json using config module
  const db = config.get("db");
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose
    .connect(db, options)
    .then(() => winston.info(`Connected to DB ${db}`))
    .catch((err) => winston.error("Error Occured"));
};
