const winston = require("winston");
const config = require("config");
require("express-async-errors");
// require("winston-mongodb");
module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: "./logs/uncaughtErrors.log" })
  );
  winston.add(
    new winston.transports.Console({
      format: winston.format.printf((log) => log.message),
    })
  );
  winston.add(new winston.transports.File({ filename: "./logs/logfile.log" }));
  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: config.get("db"),
  //     level: "error",
  //   })
  // );
};
