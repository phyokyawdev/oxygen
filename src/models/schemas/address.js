const mongoose = require("mongoose");
const Joi = require("joi");
const { objectIdJoiSchema } = require("./objectId");
const { Township } = require("../township");
const { Region } = require("../region");
const createJoiValidationError =
  require("../../services/createJoiValidationError")("address");

const addressMongooseSchema = new mongoose.Schema(
  {
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Region,
      required: true,
    },
    township: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Township,
      required: true,
    },
    additionalInfo: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// validate region and township
const regionJoiSchema = objectIdJoiSchema.external(async (region) => {
  const db_region = await Region.findById(region);
  if (!db_region)
    throw createJoiValidationError("region is invalid", { region });

  return region;
});

const townshipJoiSchema = objectIdJoiSchema.external(async (township) => {
  const db_township = await Township.findById(township);
  if (!db_township)
    throw createJoiValidationError("township is invalid", { township });

  return township;
});

const addressJoiSchema = Joi.object()
  .keys({
    region: regionJoiSchema.required(),
    township: townshipJoiSchema.required(),
    additionalInfo: Joi.string().required(),
  })
  .external(async (obj) => {
    // check consistency of region and township
    const { region, township } = obj;
    const db_township = await Township.findById(township);

    if (db_township?.region.toString() !== region) {
      throw createJoiValidationError("region and township mismatch", {
        region,
        township,
      });
    }

    return obj;
  });

module.exports = { addressMongooseSchema, addressJoiSchema };
