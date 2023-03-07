const _ = require("lodash");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const { Users, validate: validateUser } = require("../models/users");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await Users.findById(req.user._id).select("-password -__v");
  res.send(user);
});

router.post("/", async (req, res) => {
  const errorMsg = validateUser(req.body);
  if (errorMsg) return res.status(400).send(errorMsg);

  let user = await Users.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new Users(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (ex) {
    res.status(400).send("ex.message");
  }
});

module.exports = router;
