const express = require("express");
const branches = require("../routes/branches");
const employees = require("../routes/employees");
const users = require("../routes/users");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/branches", branches);
  app.use("/api/employees", employees);
  app.use("/api/users", users);
};
