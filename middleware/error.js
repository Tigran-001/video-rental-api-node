const winston = require("winston");

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);
  // Status 500 - internal server error
  res.status(500).send("Something failed.");
};
