require("module-alias/register");
const database = require("../src/startup/database");
const environment = require("../src/startup/environment");
const logger = require("@shared/logger")("seeder");

environment.check("MONGO_URI");

(async function seed() {
  try {
    await database.connect(process.env.MONGO_URI);
    logger.info("Seeding...");
    await Promise.all([require("./seedRegions"), require("./seedTownships")]);
    logger.info("Completed");
  } catch (err) {
    logger.error(err);
  }

  process.exit();
})();
