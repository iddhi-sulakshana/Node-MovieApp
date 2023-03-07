const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { Users } = require("../models/users");

const router = express.Router();

router.post("/", async (req, res) => {
  const errorMsg = validateUser(req.body);
  if (errorMsg) return res.status(400).send(errorMsg);

  const user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  const token = user.generateAuthToken();
  res.send(token);
});

function validateUser(user) {
  const schema = new Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  const result = schema.validate(user, { abortEarly: false });
  if (result.error) {
    let message = "";
    result.error.details.forEach((e) => {
      message += e.message + "\n";
    });
    return message;
  }
  return null;
}

module.exports = router;
