const express = require("express");
const branches = require("../routes/branches");
const employees = require("../routes/employees");
const users = require("../routes/users");
const login = require("../routes/login");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/branches", branches);
  app.use("/api/employees", employees);
  app.use("/api/users", users);
  app.use("/api/login", login);
};
