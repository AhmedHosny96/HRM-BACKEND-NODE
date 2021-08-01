const express = require("express");
const branches = require("../routes/branches");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/branches", branches);
};
