const express = require("express");
const branches = require("../routes/branches");
const employees = require("../routes/employees");
const users = require("../routes/users");
const login = require("../routes/login");
const jobs = require("../routes/jobs");
const error = require("../middlewares/error");
const photos = require("../routes/photos");
module.exports = function (app) {
  app.use(express.json());
  app.use("/api/branches", branches);
  app.use("/api/employees", employees);
  app.use("/api/photos", photos);
  // app.use("/api/employees/status", employees);
  app.use("/api/users", users);

  app.use("/api/login", login);
  app.use("/api/jobs/", jobs);
  app.use(error);
};
