const Joi = require("joi");
const { genreSchema } = require("./genres");
const mongoose = require("mongoose");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
    },
  })
);

function validateMovie(movie) {
  const schema = new Joi.object({
    title: Joi.string().min(5).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  const result = schema.validate(movie, { abortEarly: false });
  if (result.error) {
    let message = "";
    result.error.details.forEach((e) => {
      message += e.message + "\n";
    });
    return message;
  }
  return null;
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
