const express = require("express");
const mongoose = require("mongoose");
const { Movie, validate: validateMovie } = require("../models/movies");
const { Genres } = require("../models/genres");
const auth = require("../middleware/auth");
const router = express.Router();

// get all the movies
router.get("/", async (req, res) => {
  const movies = await Movie.find({}).sort("title");
  res.send(movies);
});

// get movie by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Invalid id");

  const movie = await Movie.findById(id);
  if (movie) return res.send(movie);

  return res.status(404).send("Not found");
});

// add new Movie
router.post("/", auth, async (req, res) => {
  const errorMsg = validateMovie(req.body);
  if (errorMsg) return res.status(400).send(errorMsg);
  if (!mongoose.isValidObjectId(req.body.genreId))
    return res.status(400).send("Invalid genre id");
  const genre = await Genres.findById(req.body.genreId).select("name");
  if (!genre) return res.status(404).send("Genre not found");

  const movie = new Movie({
    title: req.body.title,
    genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  try {
    const result = await movie.save();
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// update movie
router.put(`/:id`, auth, async (req, res) => {
  const errorMsg = validateMovie(req.body);
  if (errorMsg) return res.status(400).send(errorMsg);
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("Invalid id");
  try {
    const result = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
        },
      },
      { new: true }
    );
    if (!result) return res.status(404).send("Not Found");
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

//delete movie
router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid id");
  }
  const result = await Movie.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).send("Not found");
  res.send(result);
});

module.exports = router;
