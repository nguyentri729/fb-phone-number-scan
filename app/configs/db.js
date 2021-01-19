const config = require("../config");
const logger = require("./logger");
const mongoose = require("mongoose");
const path = require("path");
exports.connectDatabase = async (callback) => {
  try {
    const db = await mongoose.connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    logger.info("Connected to MongoDB");
    if (callback) callback();
    return db;
  } catch (err) {
    logger.info(err);
  }
};

exports.loadModelFiles = function () {
  config.getGlobbedFiles("./models/**/*.js").forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });
};
