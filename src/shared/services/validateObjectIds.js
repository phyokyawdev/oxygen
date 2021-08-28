const Joi = require("joi");
const { objectIdJoiSchema } = require("@models/schemas/objectId");

/**
 * returns validation function which can check if values of provided keys are objectId
 * @param  {...string} keys keys of the objectIds
 * @returns validate function for validateRequest
 */
function validateObjectIds(...keys) {
  const obj = {};
  keys.forEach((key) => {
    obj[key] = objectIdJoiSchema.required();
  });

  return (value) => Joi.object(obj).validateAsync(value);
}

module.exports = validateObjectIds;
