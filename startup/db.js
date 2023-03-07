const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  // database connection
  mongoose.set("strictQuery", false);
  mongoose
    .connect(config.get("db"))
    .then(() => winston.info("Connected to Database : " + config.get("db")));
};
