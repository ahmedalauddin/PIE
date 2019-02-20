/**
 * Project:  valueinfinity-mvp
 * File:     /server/util/log.js
 * Created:  2019-02-17 16:20:48
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-20 16:04:47
 * Editor:   Darrin Tisdale
 */
"use strict";

const winston = require("winston");
const path = require("path");
const config = require("../config/config");

// TODO add rollover file function

// function to produce the transports
function createTransports(caller) {
  // add in the transports, based on the configuration
  const _transports = [];

  // check for adding the standard logger
  if (isStdActive()) {
    let _sf = config.get("log.outputs.std.path");
    let _s = new winston.transports.File({
      filename: _sf,
      format: winston.format.combine(
        winston.format.label({ label: path.basename(caller) }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
      )
    });
    _transports.push(_s);
  }

  // check for adding the error logger
  if (isErrorActive()) {
    let _ef = config.get("log.outputs.error.path");
    let _e = new winston.transports.File({
      filename: _ef,
      level: "error",
      format: winston.format.combine(
        winston.format.label({ label: path.basename(caller) }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
      )
    });
    _transports.push(_e);
  }

  // check for adding a console logger
  if (isConsoleActive() || _transports.length === 0) {
    let _c = new winston.transports.Console({
      level: getConsoleLogLevel(),
      format: winston.format.combine(
        winston.format.label({ label: path.basename(caller) }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize(),
        winston.format.printf(
          info =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      )
    });
    _transports.push(_c);
  }
  return _transports;
}

// utility to determine console level of logging based on the request for logging exceptions
function getConsoleLogLevel() {
  return config.get("log.outputs.console.handleExceptions")
    ? "error"
    : config.get("log.level");
}

// utility function to determine if console logging is active
function isConsoleActive() {
  return config.get("log.outputs.console.active") === true;
}

// utility function to determine if error logging is active
function isErrorActive() {
  return config.get("log.outputs.error.active") === true;
}

// utility function to determine if std logging is active
function isStdActive() {
  return config.get("log.outputs.std.active") === true;
}

// construct the logger, with the input from the caller
const logger = caller => {
  let _l = winston.createLogger({
    level: config.get("log.level"),
    format: winston.format.simple(), // overridden by each logger
    transports: createTransports(caller),
    exitOnError: false
  });

  // create a stream object with a 'write' function that will be used by streaming loggers, if used
  _l.stream = {
    write: function(message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      logger.info(message);
    }
  };

  // return the logger
  return _l;
};

// set up the export
module.exports = logger;
