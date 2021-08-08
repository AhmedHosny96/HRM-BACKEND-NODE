const winston = require("winston");

module.exports = function (err, req, res, next) {
  // log the message error
  winston.error(err.message);

  res.status(500).send("Server Error , Something Failed.");
};
