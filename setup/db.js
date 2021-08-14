const logger = require("../logger")("db");
const mongoose = require("mongoose");

const { Region } = require("../src/models/region");
const { Township } = require("../src/models/township");
const regions_townships = require("../regions_townships.json");

async function connect(uri) {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  logger.info("Connected to Database");
}

async function populate() {
  for (const name in regions_townships) {
    const region = new Region({ name });
    await region.save();

    regions_townships[name].forEach(async (township_name) => {
      const township = new Township({
        name: township_name,
        region: region._id,
      });
      await township.save();
    });
  }
  logger.info("Populated the Database");
}

module.exports = {
  connect,
  populate,
};
