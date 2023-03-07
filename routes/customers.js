const express = require("express");
const mongoose = require("mongoose");
const { Customer, validate: validateCustomer } = require("../models/customers");

const router = express.Router();

// get all the customers
router.get("/", async (req, res) => {
  const result = await Customer.find().sort("name");
  res.send(result);
});

//get customer by id
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid id");
  }
  const result = await Customer.findById(req.params.id);
  if (!result) {
    return res.status(404).send("Customer not found");
  }
  res.send(result);
});

// create new customer
router.post("/", async (req, res) => {
  const errorMsg = validateCustomer(req.body);
  if (errorMsg) return res.status(400).send(errorMsg);
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  try {
    const result = await customer.save();
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// update customer
router.put("/:id", async (req, res) => {
  const errorMsg = validateCustomer(req.body);
  if (errorMsg) return res.status(400).send(errorMsg);
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("Invalid id provided");
  try {
    const result = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          isGold: req.body.isGold,
        },
      },
      { new: true }
    );
    if (!result) return res.status(404).send("Customer not found");
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// delete customer
router.delete("/:id", async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("Invalid id");
  const result = await Customer.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).send("Customer not found");
  res.send(result);
});

module.exports = router;
