const mongoose = require("mongoose");
const Joi = require("joi");

const locationMongooseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

const locationJoiSchema = Joi.object({
  type: Joi.string().valid("Point").required(),
  coordinates: Joi.array().length(2).items(Joi.number().required()).required(),
});

module.exports = { locationMongooseSchema, locationJoiSchema };
