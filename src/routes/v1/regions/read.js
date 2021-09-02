const express = require("express");
const { NotFoundError } = require("@shared/errors");
const { validateRequest } = require("@shared/middlewares");
const { validateObjectIds } = require("@shared/services");
const { Region } = require("@models/region");

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
