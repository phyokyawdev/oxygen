const express = require("express");
const Joi = require("joi");

const { Plant, validatePlant } = require("@models/plant");
const { validateRequest, auth } = require("@shared/middlewares");
const { NotFoundError, NotAuthorizedError } = require("@shared/errors");
const { validateObjectIds } = require("@shared/services");

const router = express.Router();

// update all info
router.put(
  "/:id",
  auth,
  validateRequest.params(validateObjectIds("id")),
  validateRequest.body(validatePlant),
  async (req, res) => {
    const plant = await findPlantAndCheckAuth(req);

    const { name, address, phones, location, managers } = req.body;
    plant.name = name;
    plant.address = address;
    plant.phones = phones;
    plant.location = location;
    plant.managers = managers;
    await plant.saveAndPopulate();

    res.send(plant);
  }
);

// update isOpen field
router.patch(
  "/:id",
  auth,
  validateRequest.params(validateObjectIds("id")),
  validateRequest.body(validateIsOpenField),
  async (req, res) => {
    const plant = await findPlantAndCheckAuth(req);

    const { isOpen } = req.body;
    plant.isOpen = isOpen;
    await plant.saveAndPopulate();

    res.send(plant);
  }
);

module.exports = router;

// helper functions
async function validateIsOpenField(val) {
  return Joi.object({
    isOpen: Joi.boolean().required(),
  }).validateAsync(val);
}

async function findPlantAndCheckAuth(req) {
  const plant = await Plant.findById(req.params.id);
  if (!plant) throw new NotFoundError("Plant not exist");

  if (!plant.isManager(req.user.id))
    throw new NotAuthorizedError("Only manager can update");

  return plant;
}
