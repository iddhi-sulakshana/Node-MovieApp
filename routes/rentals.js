const express = require("express");
const mongoose = require("mongoose");
const { Rental, validate: validateRental } = require("../models/rentals");
const { Customer } = require("../models/customers");
const { Movie } = require("../models/movies");
const router = express.Router();
router.get("/", async (req, res) => {
  const rentals = await Rental.find({}).sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Invalid id");

  const rental = await Rental.findById(id);
  if (rental) return res.send(rental);

  return res.status(404).send("Not Found");
});

router.post("/", async (req, res) => {
  const errorMsg = validateRental(req.body);
  if (errorMsg) return res.status(400).send(errorMsg);
  if (!mongoose.isValidObjectId(req.body.customerId))
    return res.status(401).send("Invalid Customer id");
  if (!mongoose.isValidObjectId(req.body.movieId))
    return res.status(401).send("Invalid Movie id");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Customer not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Movie not found");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in Stock");

  const rental = new Rental({
    customer,
    movie,
  });
  try {
    await rental.save();
    movie.numberInStock--;
    movie.save();
    res.send(rental);
  } catch (ex) {
    console.log(ex);
    res.status(401).send(ex.message);
  }
});

module.exports = router;
