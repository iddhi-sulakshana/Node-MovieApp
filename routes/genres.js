const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const mongoose = require("mongoose");
const { Genres, validate: validateGenre } = require("../models/genres");

const router = express.Router();

// get all the genres
router.get("/", async (req, res) => {
  const genres = await Genres.find({}).sort("name");
  res.send(genres);
});

// get genre by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Invalid id");

  const genre = await Genres.findById(id);
  if (genre) return res.send(genre);

  return res.status(404).send("Not found");
});

// add new genre
router.post("/", auth, async (req, res) => {
  const errorMsg = validateGenre(req.body);
  if (errorMsg) return res.status(400).send(errorMsg);
  const genre = new Genres({ name: req.body.name });
  try {
    const result = await genre.save();
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// update genre
router.put(`/:id`, auth, async (req, res) => {
  const errorMsg = validateGenre(req.body);
  if (errorMsg) return res.status(400).send(errorMsg);
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("Invalid id");
  try {
    const result = await Genres.findByIdAndUpdate(
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

//delete genre
router.delete("/:id", [auth, admin], async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid id");
  }
  const result = await Genres.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).send("Not found");
  res.send(result);
});

module.exports = router;
