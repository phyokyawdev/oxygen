const { Region } = require("@models/region");
const parseCSV = require("./parseCSV");

/**
 * returns promise
 */
module.exports = (async () => {
  if (process.env.NODE_ENV === "production")
    throw new Error("Seeding is not allowed in production");

  const region = await Region.findOne();
  if (!region) {
    const regions = await parseCSV(__dirname + "/regions.csv");
    await Region.insertMany(regions);
  }
})();
