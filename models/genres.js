const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true,
    lowercase: true,
  },
});

const Genres = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = new Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  const result = schema.validate(genre, { abortEarly: false });
  if (result.error) {
    let message = "";
    result.error.details.forEach((e) => {
      message += e.message + "\n";
    });
    return message;
  }
  return null;
}

module.exports.Genres = Genres;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;
