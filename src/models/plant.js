const mongoose = require("mongoose");
const Joi = require("joi");

const {
  addressMongooseSchema,
  addressJoiSchema,
} = require("./schemas/address");
const {
  locationMongooseSchema,
  locationJoiSchema,
} = require("./schemas/location");
const { phoneJoiSchema } = require("./schemas/phone");
const { managersJoiSchema } = require("./schemas/managers");
const { objectIdJoiSchema } = require("./schemas/objectId");

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: addressMongooseSchema,
      required: true,
    },
    phones: {
      type: [String],
      required: true,
    },
    location: {
      type: locationMongooseSchema,
      index: "2dsphere",
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    managers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

plantSchema.methods.isManager = function (id) {
  for (const manager of this.managers) {
    if (manager.toString() === id) return true;
  }
  return false;
};

plantSchema.methods.saveAndPopulate = async function () {
  await this.save();
  await this.populate("address.region")
    .populate("address.township")
    .execPopulate();
  await this.populate("managers", "userName").execPopulate();
};

const Plant = mongoose.model("Plant", plantSchema);

// request validation schemas
async function validatePlant(plant) {
  const schema = Joi.object().keys({
    name: Joi.string().trim().required(),
    address: addressJoiSchema.required(),
    phones: Joi.array().items(phoneJoiSchema.required()).required(),
    location: locationJoiSchema.optional(),
    managers: managersJoiSchema.required(),
  });

  return schema.validateAsync(plant);
}

function validateQuery(query) {
  const schema = Joi.object()
    .keys({
      region: objectIdJoiSchema,
      township: objectIdJoiSchema,
      near: locationJoiSchema,
      isOpen: Joi.boolean(),
      offset: Joi.number().min(0).default(0),
      limit: Joi.number().positive().default(20),
    })
    .oxor("region", "township", "near");

  return schema.validateAsync(query);
}

module.exports = { Plant, validatePlant, validateQuery };
