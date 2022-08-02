const winston = require("winston");
const express = require("express");
const app = express();

require("./startup.js/logging")();
require("./startup.js/routes")(app);
require("./startup.js/db")();
require("./startup.js/config")();
require("./startup.js/prod")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
