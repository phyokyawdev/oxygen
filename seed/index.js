require("module-alias/register");
const { connectDb, checkEnv } = require("../src/startup");
const logger = require("@shared/logger")("seeder");

checkEnv("MONGO_URI");

(async function seed() {
  try {
    await connectDb(process.env.MONGO_URI);
    logger.info("Seeding...");
    await Promise.all([require("./seedRegions"), require("./seedTownships")]);
    logger.info("Completed");
  } catch (err) {
    logger.error(err);
  }

  process.exit();
})();
