const config = require("config");

module.exports = function () {
  if (!config.get("jwtSecretKey")) {
    throw new Error("FATAL ERROR: jwtSecretKey is not defined.");
  }
};
