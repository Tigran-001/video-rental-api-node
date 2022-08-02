const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");
const rentals = require("../routes/rentals");
const movies = require("../routes/movies");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const returns = require("../routes/returns");
const errorHandler = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(errorHandler);
};
