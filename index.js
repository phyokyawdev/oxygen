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

const env_variables = [
  "PORT",
  "MONGO_URI",
  "JWT_PRIVATE_KEY",
  "JWT_PUBLIC_KEY",
  "COOKIE_KEYS",
];

const start = async () => {
  logger.info("Starting server...");

  // check env variables
  env.check(env_variables);

  const mongoUri = process.env.MONGO_URI;
  const port = process.env.PORT;

  // connect to db
  try {
    await db.connect(mongoUri);
  } catch (err) {
    throw err;
  }

  // serve app
  app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });
};

start();
