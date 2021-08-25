const Joi = require("joi");
const mm = require("myanmar-phonenumber");

const phoneMongooseSchema = String;

function validatePhone(value, helper) {
  if (!mm.isValidMMPhoneNumber(value)) throw new Error("invalid phone number");

  return value;
}

const phoneJoiSchema = Joi.string()
  .custom(validatePhone, "validate phone number")
  .message("Invalid phone number");

module.exports = { phoneMongooseSchema, phoneJoiSchema };
