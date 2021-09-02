const express = require("express");

const { Plant, validateQuery } = require("@models/plant");
const { Township } = require("@models/township");
const { Region } = require("@models/region");

const { NotFoundError } = require("@shared/errors");
const { validateRequest } = require("@shared/middlewares");
const { validateObjectIds } = require("@shared/services");

const router = express.Router();

// get all
router.get(
  "/",
  validateRequest.query(validateQuery),
  async (req, res, next) => {
    const { region, township, near, isOpen, offset, limit } = req.query;

    // redirect for near route
    if (near) return next("route");

    // build query
    const query = {};
    if (region) query["address.region"] = region;
    if (township) query["address.township"] = township;
    if (isOpen !== undefined) query.isOpen = isOpen;

    const plants = await Plant.find(query)
      .select("-managers")
      .skip(offset)
      .limit(limit)
      .populate("address.region")
      .populate("address.township");

    res.send(plants);
  }
);

router.get("/", async (req, res) => {
  const { near, isOpen, offset, limit } = req.query;

  const query = {};
  if (isOpen !== undefined) query.isOpen = isOpen;

  let plants = await Plant.aggregate([
    {
      $geoNear: {
        near,
        distanceField: "distance",
        spherical: true,
        maxDistance: 10000,
      },
    },
    { $match: query },
    { $unset: ["managers", "__v"] },
    { $skip: offset },
    { $limit: limit },
    {
      $project: {
        phones: 1,
        name: 1,
        address: 1,
        location: 1,
        isOpen: 1,
        distance: 1,
        id: "$_id",
        _id: 0,
      },
    },
  ]);

  plants = await Region.populate(plants, { path: "address.region" });
  plants = await Township.populate(plants, { path: "address.township" });

  res.send(plants);
});

// get one
router.get(
  "/:id",
  validateRequest.params(validateObjectIds("id")),
  async (req, res) => {
    const plant = await Plant.findById(req.params.id)
      .select("-managers")
      .populate("address.region")
      .populate("address.township");

    if (!plant) throw new NotFoundError();

    res.send(plant);
  }
);

module.exports = router;
