const { ValidationError, NotFoundError } = require("../errors");

const generateValidator = (name) => (validate) => async (req, res, next) => {
  try {
    req[name] = await validate(req[name]);
  } catch (err) {
    if (name === "params")
      return next(new NotFoundError("Invalid request params"));
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
