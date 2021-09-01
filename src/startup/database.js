const mongoose = require("mongoose");
const logger = require("@shared/logger")("db");

async function connect(uri) {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  logger.info("Connected to Database");
}

module.exports = {
  connect,
};
