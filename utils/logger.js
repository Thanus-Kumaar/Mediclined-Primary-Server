const winston = require("winston");
const path = require('path');

const logDirectory = path.join(__dirname, '../logs');

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});

const errorFormatter = winston.format((info) => {
  if (info.level === 'error' && info.error) {
    const { message, name, stack } = info.error;
    // Extract the first few lines of the stack (e.g., error type, message, and location)
    const stackLines = stack.split("\n");
    const firstLines = stackLines.slice(0, 2).join("; ");
    const lastLine = stackLines[stackLines.length - 1];
    const stackSummary = `${firstLines}; ... ${lastLine}`;

    // Update info object with structured error details
    info.error = {
      type: name || 'Error',
      message: message || 'An error occurred',
      stack_summary: stackSummary,
    };
  }
  return info;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    errorFormatter(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, 'info.log'),
      level: "info",
      format: winston.format.combine(
        infoFilter(),
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 5242880,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: "error",
      maxsize: 5242880,
      maxFiles: 5
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
  exitOnError: false,
});

module.exports = logger;
