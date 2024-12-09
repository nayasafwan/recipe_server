const Winston = require("winston");


const { createLogger, format, transports } = Winston;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format(info => ({ ...info, level: `[${info.level.toUpperCase()}]:` }))(),
  format.colorize({ all: true }),
  format.simple(),
  format.splat(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level} ${message}`;
  })
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    })
  ],
});


module.exports = logger;