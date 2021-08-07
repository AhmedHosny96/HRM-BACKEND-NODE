const winston = require("winston");
// require("winston-mongodb"); // for storing logfiles in the mongodb
require("express-async-error");

module.exports = function () {
  // handle uncaughtException
  winston.handleExceptions(
    new winston.transports.File({ filename: "unCaughtExceptions.log" })
  );

  process.on("unHandledRejection", (err) => {
    throw err;
  });

  // winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, {
  //   db: "mongodb://localhost:27017/HRM_DB",
  //   level: "info",
  // });
};
