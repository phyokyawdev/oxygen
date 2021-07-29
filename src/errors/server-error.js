class ServerError extends Error {
  constructor(statusCode, message) {
    if (statusCode < 500 || statusCode > 599) {
      throw new TypeError("ServerError statusCode must be 5xx");
    }
    super(message);
    this.name = "ServerError";
    this.statusCode = statusCode;
  }

  serialize() {
    return [{ message: this.message }];
  }
}

module.exports = ServerError;
