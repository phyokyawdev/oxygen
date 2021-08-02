const ValidationError = require("../errors/validation-error");

const generateValidator = (name) => (validate) => async (req, res, next) => {
  try {
    req[name] = await validate(req[name]);
  } catch (err) {
    return next(new ValidationError(err));
  }
  next();
};

const validateRequest = {
  body: generateValidator("body"),
  params: generateValidator("params"),
  query: generateValidator("query"),
};

module.exports = validateRequest;
