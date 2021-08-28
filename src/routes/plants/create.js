const express = require("express");
const { validateRequest, auth } = require("@shared/middlewares");
const { Plant, validatePlant } = require("@models/plant");

const router = express.Router();

router.post(
  "/",
  auth,
  validateRequest.body(validatePlant),
  async (req, res) => {
    const { name, address, phones, location, managers } = req.body;

    const plant = new Plant({
      name,
      address,
      phones,
      location,
      isOpen: false,
      managers,
    });
    await plant.saveAndPopulate();

    res.status(201).send(plant);
  }
);

module.exports = router;
