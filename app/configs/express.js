const express = require("express");
const app = express();
const config = require("../config");
const logger = require("./logger");
const path = require("path");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

exports.loadRoutes = () => {
  config.getGlobbedFiles("./routes/**/*.js").forEach(function (modelPath) {
    require(path.resolve(modelPath))(app);
  });
};

exports.loadExpress = () => {
  app.listen(config.port, (err) => {
    if (err) logger.warning(err);
    logger.info("Server is running on port " + config.port);
  });
};
