const Joi = require("joi");

const createJoiValidationError =
  (parentPath = "") =>
  /**
   * Create new JoiValidationError instance with already provided parentPath
   * @param {string} message error message
   * @param {*} obj { key: value, ... } || [value, ...]
   * @returns new Joi.ValidationError()
   */
  (message, obj) => {
    const details = Object.keys(obj).map((key) => {
      if (!isNaN(key)) key = +key;

      return {
        message,
        path: parentPath ? [parentPath, key] : [key],
        type: message,
        context: {
          key,
          label: parentPath
            ? typeof key == "number"
              ? `${parentPath}[${key}]`
              : `${parentPath}.${key}`
            : key,
          value: obj[key],
        },
      };
    });

    return new Joi.ValidationError(message, details, obj);
  };

module.exports = createJoiValidationError;
