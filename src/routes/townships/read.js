const express = require("express");
const { NotFoundError } = require("../../errors");
const { validateRequest } = require("../../middlewares");
const { Township } = require("../../models/township");
const validateObjectIds = require("../../services/validateObjectIds");

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  validateRequest.params(validateObjectIds("regionId")),
  async (req, res) => {
    const townships = await Township.find({ region: req.params.regionId });

    res.send(townships);
  }
);

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
