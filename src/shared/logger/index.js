const productionLogger = require("./production");
const developmentLogger = require("./development");
const isProduction = process.env.NODE_ENV === "production";

let logger;

if (isProduction) {
  logger = productionLogger;
} else {
  logger = developmentLogger;
}

module.exports = logger;
