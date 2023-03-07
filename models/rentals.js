const Joi = require("joi");
const mongoose = require("mongoose");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          min: 5,
        },
        phone: {
          type: Number,
          min: 10,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          trim: true,
          required: true,
          minlength: 5,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(rental) {
  const schema = new Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });
  const result = schema.validate(rental, { abortEarly: false });
  if (result.error) {
    let message = "";
    result.error.details.forEach((e) => {
      message += e.message + "\n";
    });
    return message;
  }
  return null;
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
