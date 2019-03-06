/**
 * Project:  valueinfinity-mvp
 * File:     /server/util/log.js
 * Created:  2019-02-17 16:20:48
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-06 18:10:24
 * Editor:   Darrin Tisdale
 */
/* eslint no-console: "off" */
"use strict";

// declarations
const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const config = require("../config/config");

/* ONE TIME SETUP
We set up the winston logger configuration when the
module is first invoked.On subsequent invocations,
we use the existing logger, with the specific
formats defined in the class instance */

/**
 * default transport configurations
 */
const _transports = {
  std: {
    active: isStdActive(),
    transport: new winston.transports.DailyRotateFile({
      name: "std",
      filename: config.get("log.outputs.std.path"),
      format: winston.format.json(),
      maxSize: config.get("log.outputs.std.maxSize"),
      maxFiles: config.get("log.outputs.std.count"),
      zippedArchive: true
    })
  },
  error: {
    active: isErrorActive(),
    transport: new winston.transports.DailyRotateFile({
      name: "error",
      filename: config.get("log.outputs.error.path"),
      format: winston.format.json(),
      maxSize: config.get("log.outputs.std.maxSize"),
      maxFiles: config.get("log.outputs.std.count"),
      zippedArchive: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  },
  console: {
    active: isConsoleActive() || (!isStdActive() && !isErrorActive()),
    transport: new winston.transports.Console({
      name: "console",
      level: getConsoleLogLevel(),
      format: winston.format.json()
    })
  }
};

/**
 * utility to define the json winston formatter
 * based on information provided in the config
 *
 * @param {string} label text to be inserted as a label
 * @returns winston.format for winston.logger
 */
function createJsonFormat(label = "") {
  return winston.format.combine(
    winston.format.label({ label: label }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  );
}

/**
 * utility to define the console winston formatter
 * based on information provided in the config
 *
 * @param {string} label text to be inserted as a label
 * @returns winston.format for winston.logger
 */
function createConsoleFormat(label = "") {
  return winston.format.combine(
    winston.format.label({ label: label }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf(
      info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  );
}

/**
 * utility to determine console level of logging
 * based on the request for logging exceptions
 *
 * @returns console logging level
 */
function getConsoleLogLevel() {
  return config.get("log.outputs.console.handleExceptions")
    ? "debug"
    : config.get("log.level");
}

/**
 * utility function to determine if console logging is active
 *
 * @returns true if console logging is active
 */
function isConsoleActive() {
  return config.get("log.outputs.console.active") === true;
}

/**
 * utility function to determine if error logging is active
 *
 * @returns true if error logging is active
 */
function isErrorActive() {
  return config.get("log.outputs.error.active") === true;
}

/**
 * utility function to determine if std logging is active
 *
 * @returns true if standard logging is active
 */
function isStdActive() {
  return config.get("log.outputs.std.active") === true;
}

function getTransports(label = "") {
  let _t = [];
  if (_transports.std.active) {
    _transports.std.transport.format = createJsonFormat(label);
    _t.push(_transports.std.transport);
  }
  if (_transports.error.active) {
    _transports.error.transport.format = createJsonFormat(label);
    _t.push(_transports.error.transport);
  }
  if (_transports.console.active) {
    _transports.console.transport.format = createConsoleFormat(label);
    _t.push(_transports.console.transport);
  }
  return _t;
}

// create and configure master logger instance
var _logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4
  },
  level: config.get("log.level"),
  format: winston.format.json(), // overridden by each logger
  transports: getTransports(),
  exitOnError: false,
  rewriters: [
    (level, msg, meta) => {
      meta.app = "valueinfinity-mvp";
      return meta;
    }
  ]
});

// create the class that we will use for wrapping the winston logger
/* eslint no-unused-vars: "off" */
/**
 * Wrapper class for winston logger, to keep
 * labels specific to the file in which they
 * where created
 *
 * @class LoggerPlus
 */
class LoggerPlus {
  /**
   *Creates an instance of LoggerPlus.
   * @param {string} module module's file path for documentation purposes
   * @memberof LoggerPlus
   */
  constructor(module = "") {
    // store the local variables used
    if (module) {
      this.moduleFile = path.basename(module);
      this.moduleFolder = path
        .dirname(module)
        .split(path.sep)
        .pop();
    } else {
      this.moduleFile = "*";
      this.moduleFolder = "*";
    }
    const namespace = `${this.moduleFolder}::${this.moduleFile}`;
    this.transports = getTransports(namespace);
    this.logger = _logger;
  }

  /**
   * Outputs a message to the log
   *
   * @param {string} level the level of the message
   * @param {string} message the message
   * @param {*} meta metadata associated with the message
   * @memberof LoggerPlus
   */
  log(level, message, meta) {
    // reconfigure the logger for the message we are going to send
    this.logger.configure({ transports: this.transports });

    // output the message
    this.logger.log(level, message, meta);
  }

  /**
   * outputs a log message at level of info
   *
   * @param {string} message the message
   * @param {*} meta metadata associated with the message
   * @memberof LoggerPlus
   */
  info(message, meta) {
    //call the general function, setting the level
    this.log("info", message, meta);
  }

  /**
   * outputs a log message at level of error
   *
   * @param {string} message the message
   * @param {*} meta metadata associated with the message
   * @memberof LoggerPlus
   */
  error(message = "", meta = {}) {
    //call the general function, setting the level
    this.log("error", message, meta);
  }

  /**
   * outputs a log message at level of warn
   *
   * @param {string} message the message
   * @param {*} meta metadata associated with the message
   * @memberof LoggerPlus
   */
  warn(message, meta) {
    //call the general function, setting the level
    this.log("warn", message, meta);
  }

  /**
   * outputs a log message at level of verbose
   *
   * @param {string} message the message
   * @param {*} meta metadata associated with the message
   * @memberof LoggerPlus
   */
  verbose(message, meta) {
    //call the general function, setting the level
    this.log("verbose", message, meta);
  }

  /**
   * outputs a log message at level of debug
   *
   * @param {string} message the message
   * @param {*} meta metadata associated with the message
   * @memberof LoggerPlus
   */
  debug(message, meta) {
    //call the general function, setting the level
    this.log("debug", message, meta);
  }
}

/**
 * defines the export of the module to be a
 * new instance of the LoggerPlus class
 *
 * @param { string } module the file path of the module calling
 * @returns {LoggerPlus} instance of LoggerPlus class
 */
module.exports = module => {
  // construct a new instance of the class and return it
  return new LoggerPlus(module);
};
