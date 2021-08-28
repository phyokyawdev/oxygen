const mongoose = require("mongoose");
const Joi = require("joi");
const { Township } = require("@models/township");
const { objectIdJoiSchema } = require("@models/schemas/objectId");
const { createJoiValidationError } = require("@shared/services");

const addressMongooseSchema = new mongoose.Schema(
  {
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
    township: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Township",
      required: true,
    },
    additionalInfo: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// validate request schemas
const addressJoiSchema = Joi.object()
  .keys({
    township: objectIdJoiSchema.required(),
    additionalInfo: Joi.string().required(),
  })
  .external(async (address) => {
    const township = await Township.findById(address.township);
    if (!township)
      throw createJoiValidationError("township not exist", ["address"], {
        township,
      });

    const new_address = {
      region: township.region,
      township: township._id,
      additionalInfo: address.additionalInfo,
    };

    return new_address;
  });

module.exports = { addressMongooseSchema, addressJoiSchema };
