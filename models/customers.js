const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
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
  })
);

function validateCustomer(customer) {
  const schema = new Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.number().min(10).required(),
    isGold: Joi.boolean(),
  });
  const result = schema.validate(customer, { abortEarly: false });
  if (result.error) {
    let message = "";
    result.error;
    result.error.details.forEach((e) => {
      message += e.message + "\n";
    });
    return message;
  }
  return null;
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
