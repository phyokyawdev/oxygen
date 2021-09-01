const { Township } = require("@models/township");
const parseCSV = require("./parseCSV");

/**
 * returns promise
 */
module.exports = (async () => {
  if (process.env.NODE_ENV === "production")
    throw new Error("Seeding is not allowed in production");

  const township = await Township.findOne();
  if (!township) {
    const townships = await parseCSV(__dirname + "/townships.csv");
    await Township.insertMany(townships);
  }
})();
