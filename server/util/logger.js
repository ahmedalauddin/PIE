/**
 * Project:  valueinfinity-mvp
 * File:     /server/util/log.js
 * Created:  2019-02-17 16:20:48
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-06 15:32:24
 * Editor:   Darrin Tisdale
 */
/* eslint no-console: "off" */
"use strict";

// declaraations
const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const config = require("../config/config");

/* ONE TIME SETUP
We set up the winston logger configuration when the
module is first invoked.On subsequent invocations,
we use the existing logger */

// local variables
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

function createJsonFormat(label) {
  return winston.format.combine(
    winston.format.label({ label: label }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  );
}

function createConsoleFormat(label) {
  return winston.format.combine(
    winston.format.label({ label: label }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf(
      info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  );
}

// utility to determine console level of logging based on the request for logging exceptions
function getConsoleLogLevel() {
  return config.get("log.outputs.console.handleExceptions")
    ? "debug"
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

function getTransports(label = "") {
  let _t = [];
  //console.debug(`std.active: ${_transports.std.active}`);
  if (_transports.std.active) {
    _transports.std.transport.format = createJsonFormat(label);
    _t.push(_transports.std.transport);
  }
  //console.debug(`error.active: ${_transports.error.active}`);
  if (_transports.error.active) {
    _transports.error.transport.format = createJsonFormat(label);
    _t.push(_transports.error.transport);
  }
  //console.debug(`console.active: ${_transports.console.active}`);
  if (_transports.console.active) {
    _transports.console.transport.format = createConsoleFormat(label);
    _t.push(_transports.console.transport);
  }
  //console.debug(`transports: ${_t.length}`);
  return _t;
}

// debug logger creation
//console.debug(`creating logger instance, level: ${config.get("log.level")}`);
const logger = winston.createLogger({
  level: config.get("log.level"),
  format: winston.format.json(), // overridden by each logger
  transports: getTransports(),
  exitOnError: false
});

// create the class that we will use for wrapping the winston logger
/* eslint no-unused-vars: "off" */
class LoggerPlus {
  constructor(options, module) {
    // store the local variables used
    this.winston = winston;
    this.moduleFile = path.basename(module);
    this.moduleFolder = path
      .dirname(module)
      .split(path.sep)
      .pop();
  }

  generateMessage(level, message, source) {
    // Set the prefix which will cause debug to enable the message
    const namespace = `${this.moduleFile}:${level}`;
  }
}

// export the function to adjust the label
module.exports = module => {
  // construct the label
  let _moduleFile = path.basename(module);

  // apply it to the logger
  //console.debug(`configuring logger label to [${_moduleFile}]`);
  logger.configure({
    level: config.get("log.level"),
    format: winston.format.json(),
    transports: getTransports(_moduleFile),
    exitOnError: false
  });

  // return the logger
  //console.debug(`returning logger for [${_moduleFile}]`);
  return logger;
};

// TODO handle the label better, it still does not work like it really should
