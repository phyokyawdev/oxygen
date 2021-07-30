const logger = require("../logger")("app");
const express = require("express");
require("express-async-errors");

const ClientError = require("./errors/client-error");
const errorHandler = require("./middlewares/error-handler");

logger.debug("Preparing app...");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("*", async (req, res) => {
  throw new ClientError(404, "Not found");
});

app.use(errorHandler);

logger.debug("Preparing completed");
module.exports = app;
