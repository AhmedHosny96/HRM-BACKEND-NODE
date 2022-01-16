const express = require("express");
const branches = require("../routes/branches");
const employees = require("../routes/employees");
const users = require("../routes/users");
const login = require("../routes/auth");
const jobs = require("../routes/jobs");
const error = require("../middlewares/error");
const recruitments = require("../routes/recruitments");
const documents = require("../routes/documents");
const leaveRequests = require("../routes/leaveRequests");
const leaves = require("../routes/leaves");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/branches", branches);
  app.use("/api/employees", employees);
  app.use("/api/employees/branch", employees);
  app.use("/api/users", users);
  app.use("/api/auth", login);
  app.use("/api/jobs", jobs);
  app.use("/api/recruitments", recruitments);
  app.use("/api/employee/documents", documents);
  app.use("/api/employee/leave", leaveRequests);
  app.use("/api/leaves", leaves);

  app.use(error);
};
