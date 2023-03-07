const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
  res.status(401).send("Unauthorized page leave immediately.");
});
module.exports = router;
