const ClientError = require("./client-error");

class ValidationError extends ClientError {
  constructor(details = []) {
    super(400, "Validation Error");
    this.name = "ValidationError";
    this.details = details;
  }

  serialize() {
    return this.details;
  }
}

module.exports = ValidationError;
