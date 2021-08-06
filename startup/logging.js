const winston = require("winston");
require("winston-mongodb"); // for storing logfiles in the mongodb
require("express-async-error");

module.exports = function () {
  // handle uncaughtExceptions

  // console configuration
  // handling uncaughtExceptions and transporting them to local file
  winston.configure({
    transports: [
      new winston.transports.Console({ colorize: true, prettyPrint: true }),
      new winston.transports.File({ filename: "unCaughtExceptions.log" }),
    ],
  });

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  // logging everything and storing them in logfile locally
  winston.configure({
    transports: [new winston.transports.File({ filename: "logfile.log" })],
  });
  // storing the logfile in MongoDB
  winston.configure({
    transports: [
      new winston.transports.MongoDB({
        db: "mongodb://localhost/HRM_DB",
        level: "info",
      }),
    ],
  });
};
