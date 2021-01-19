const winston = require("winston");
// const path = require("path");
const config = require("../config");

module.exports = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.colorize(),
    winston.format.printf((log) => {
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      silent: config.logger,
    }),
    // new winston.transports.File({
    //   level: "error",
    //   filename: path.join(__dirname, "errors.log"),
    // }),
  ],
});
