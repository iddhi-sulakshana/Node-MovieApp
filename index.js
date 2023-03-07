const express = require("express");
const winston = require("winston");
const PORT = require("./startup/port");

const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);

const server = app.listen(PORT, () => {
  winston.info("Listening on http://localhost:" + PORT);
});

module.exports = server;
