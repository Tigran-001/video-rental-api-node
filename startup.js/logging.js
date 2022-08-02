const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  // For synchronous code
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );
  // For asynchronous code
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, {
  //   db: "mongodb://localhost/vidly",
  //   level: "info",
  // });
};
