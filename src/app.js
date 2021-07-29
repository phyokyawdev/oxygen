const logger = require("../logger")("app");
const express = require("express");
const app = express();

logger.debug("Preparing app...");

app.get("/", (req, res) => {
  res.send("Hello World");
});

logger.debug("Preparing completed");
module.exports = app;
