const express = require("express");
const { NotFoundError } = require("@shared/errors");
const { validateRequest } = require("@shared/middlewares");
const { validateObjectIds } = require("@shared/services");
const { Township } = require("@models/township");

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const townships = await Township.find({ region: req.params.regionId });

  res.send(townships);
});

router.get(
  "/:id",
  validateRequest.params(validateObjectIds("regionId", "id")),
  async (req, res) => {
    const township = await Township.findOne({
      _id: req.params.id,
      region: req.params.regionId,
    });

    if (!township) throw new NotFoundError();

    res.send(township);
  }
);

module.exports = router;
