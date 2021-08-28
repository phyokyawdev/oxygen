const Joi = require("joi");
const { createJoiValidationError } = require("@shared/services");
const { objectIdJoiSchema } = require("@models/schemas/objectId");
const { User } = require("@models/user");

const managersJoiSchema = Joi.array()
  .unique()
  .items(objectIdJoiSchema.required())
  .external(async (managers) => {
    await Promise.all(
      managers.map(async (manager, index) => {
        const isExistingUser = await User.isExistingUser(manager);

        if (!isExistingUser) {
          const arr = [];
          arr[index] = manager;
          throw createJoiValidationError(
            "manager should be an existing user",
            ["managers"],
            arr
          );
        }
      })
    );

    return managers;
  });

module.exports = { managersJoiSchema };
