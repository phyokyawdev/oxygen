const fs = require("fs");
const csv = require("csv-parser");

/**
 * parse CSV to JSON
 * @param {string} file path: fs.PathLike
 * @returns {Promise<Array>} array of JSON objects
 */
async function parseCSV(file) {
  const datas = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (data) => datas.push(data))
      .on("end", () => resolve(datas));
  });
}

module.exports = parseCSV;
