const path = require("path");
const { createLogger, transports } = require("winston");
const { format } = require("logform");
const { combine, colorize, errors, timestamp, printf, ms, json } = format;

const level = process.env.LOG_LEVEL || "info";
const allLog = path.join(__dirname, "../../../logs/all.log");

const consolePrint = ({ timestamp, level, message, stack, ms }) => {
  const ts = timestamp.slice(0, 19).replace("T", " ");
  return `${ts} ${level} ${message}  ${ms} ${stack ? "\n" + stack : ""}`;
};

const combineLabelAndLevel = format((info, opts) => {
  info.level = `${info.label}:${info.level}`;
  return info;
});

const console = new transports.Console({
  format: combine(
    combineLabelAndLevel(),
    timestamp(),
    colorize(),
    errors({ stack: true }),
    ms(),
    printf(consolePrint)
  ),
});

const file = new transports.File({
  filename: allLog,
  format: combine(timestamp(), errors({ stack: true }), ms(), json()),
});

const logger = createLogger({
  level,
  transports: [console, file],
});

module.exports = function generateLogger(name) {
  return {
    error: (message) => {
      logger.error(message, { label: name });
    },
    warn: (message) => {
      logger.warn(message, { label: name });
    },
    info: (message) => {
      logger.info(message, { label: name });
    },
    verbose: (message) => {
      logger.verbose(message, { label: name });
    },
    debug: (message) => {
      logger.debug(message, { label: name });
    },
  };
};
