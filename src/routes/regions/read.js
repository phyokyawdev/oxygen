const express = require("express");
const { NotFoundError } = require("../../errors");
const { validateRequest } = require("../../middlewares");
const { Region } = require("../../models/region");
const validateObjectIds = require("../../services/validateObjectIds");

const router = express.Router();

router.get("/", async (req, res) => {
  const regions = await Region.find({});

  res.send(regions);
});

router.get(
  "/:id",
  validateRequest.params(validateObjectIds("id")),
  async (req, res) => {
    const region = await Region.findById(req.params.id);

    if (!region) throw new NotFoundError();

    res.send(region);
  }
);

module.exports = router;
