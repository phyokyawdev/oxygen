require("module-alias/register");

const environment = require("./startup/environment");
const database = require("./startup/database");
const logger = require("@shared/logger")("index");
const app = require("@app");

// listen and log unexpected errors
process.on("uncaughtExceptionMonitor", (err) => {
  logger.error("Uncaught Exception");
  logger.error(err);
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection");
  logger.error(err);
  process.exit(1);
});

environment.check(
  "PORT",
  "MONGO_URI",
  "JWT_PRIVATE_KEY",
  "JWT_PUBLIC_KEY",
  "COOKIE_KEYS"
);

const start = async () => {
  logger.info("Starting server");

  await database.connect(process.env.MONGO_URI);
  await database.populate();

  app.listen(process.env.PORT, () => {
    logger.info(`Listening on port ${process.env.PORT}`);
  });
};

start();
