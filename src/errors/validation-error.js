const BadRequestError = require("./bad-request-error");

class ValidationError extends BadRequestError {
  constructor(err) {
    super("Validation Error");
    this.name = "ValidationError";
    this.details = err.details;
  }

  serialize() {
    return this.details;
  }
}

module.exports = ValidationError;
