const Joi = require("joi");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    _.pick(this, ["_id", "isAdmin"]),
    config.get("jwtPrivateKey")
  );
};

const Users = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = new Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    isAdmin: Joi.bool(),
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

module.exports.Users = Users;
module.exports.validate = validateUser;
