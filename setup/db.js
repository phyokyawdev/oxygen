const logger = require("../logger")("db");
const mongoose = require("mongoose");

module.exports = {
  connect: async (uri) => {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    logger.info("Connected to Database");
  },
};
