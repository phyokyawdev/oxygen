const logger = require("./logger")("index");

const app = require("./src/app");
const db = require("./setup/db");
const env = require("./setup/env");

process.on("uncaughtExceptionMonitor", (err) => {
  logger.error("Uncaught Exception");
  logger.error(err);
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection");
  logger.error(err);
  process.exit(1);
});

const env_variables = ["PORT", "MONGO_URI"];

const start = async () => {
  logger.info("Starting server...");

  // check env variables
  env.check(env_variables);

  // connect to db
  try {
    await db.connect(process.env.MONGO_URI);
  } catch (err) {
    throw err;
  }

  // serve app
  app.listen(process.env.PORT, () => {
    logger.info(`Listening on port ${process.env.PORT}`);
  });
};

start();
