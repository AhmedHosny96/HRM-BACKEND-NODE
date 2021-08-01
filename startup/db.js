const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  // get db env varaible from default.json using config module
  const db = config.get("db");
  mongoose.connect(db).then(() => console.log(`Connected to DB ${db}`));
};
