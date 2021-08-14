const mongoose = require("mongoose");
const Joi = require("joi");

const objectIdMongooseSchema = mongoose.Schema.Types.ObjectId;

const objectIdJoiSchema = Joi.string()
  .custom((value) => {
    if (!mongoose.isValidObjectId(value)) throw new Error("invalid object id");
    return value;
  })
  .message("Invalid Object Id");

module.exports = { objectIdMongooseSchema, objectIdJoiSchema };
