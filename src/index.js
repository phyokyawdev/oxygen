require("module-alias/register");

const { connectDb, checkEnv } = require("./startup");
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

checkEnv(
  "PORT",
  "MONGO_URI",
  "JWT_PRIVATE_KEY",
  "JWT_PUBLIC_KEY",
  "COOKIE_KEYS"
);

const start = async () => {
  logger.info("Starting server");

  await connectDb(process.env.MONGO_URI);

  app.listen(process.env.PORT, () => {
    logger.info(`Listening on port ${process.env.PORT}`);
  });
};

start();
