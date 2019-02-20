/**
 * Project:  valueinfinity-mvp
 * File:     /app.js
 * Created:  2019-02-16 11:29:38
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-20 11:17:04
 * Editor:   Darrin Tisdale
 */
"use strict";

import express from "express";
import createError from "http-errors";
import { join } from "path";
import { json, urlencoded } from "body-parser";
const logger = require("./server/util/logger")(__filename);
var expressWinston = require("express-winston");
var cookieParser = require("cookie-parser")();
var config = require("./server/config/config");

// function to determine environment
const isHosted = () => {
  return config.get("env") === "host" || config.get("env") === "prod";
};

// create the instance of express
logger.debug(`constructing express app`);
var app = express();

// Parse incoming requests data (https://github.com/expressjs/body-parser)
logger.debug(`adding parsers`);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser);

// view engine setup
// TODO maybe we refactor this out?
logger.debug(`adding views`);
app.set("views", join(__dirname, "server/views"));
app.set("view engine", "pug");

// add support for static files and the built react app
let serverPath = isHosted()
  ? join(__dirname, "client/build")
  : join(__dirname, "server/public");
logger.debug(`setting static root of express server to ${serverPath}`);
app.use(express.static(serverPath));

// create a router
var router = express.Router();

// set the home path
logger.debug(`router GET -> path: /*`);
router.get("/*", (req, res) => {
  if (isHosted()) {
    res.sendFile(join(serverPath, "/index.html"));
  } else {
    res.status(200).send({
      message: "Welcome to the Value Infinity MVP API"
    });
  }
});

// add in the other paths handled by express
require("./server/routes/index")(router);
require("./server/routes/organization")(router);
require("./server/routes/person")(router);
require("./server/routes/project")(router);
require("./server/routes/kpi")(router);
require("./server/routes/mindmap")(router);
require("./server/routes/auth")(router);

// error handlers
// catch 404 and forward to error handler
router.use(function(req, res, next) {
  next(createError(404));
});

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// set an expressWinston router for the application
app.use(
  expressWinston.logger({
    transports: logger.transports,
    format: logger.format,
    statusLevels: false,
    level: function(req, res) {
      var level = "";
      if (res.statusCode >= 100) {
        level = "info";
      }
      if (res.statusCode >= 400) {
        level = "warn";
      }
      if (res.statusCode >= 500) {
        level = "error";
      }
      // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
      if (res.statusCode == 401 || res.statusCode == 403) {
        level = "critical";
      }
      // No one should be using the old path, so always warn for those
      if (req.path === "/api" && level === "info") {
        level = "warn";
      }
      return level;
    }
  })
);

// now set the routes for the app
app.use(router);

// now add in the error logger
// note that the formats defined by the logger should
// handle the formatting of the logs properly
if (
  config.get("log.outputs.console.handleExceptions") &&
  config.get("log.outputs.console.active")
) {
  app.use(
    expressWinston.errorLogger({
      transports: logger.transports,
      format: logger.format,
      dumpExceptions: true,
      showStack: true
    })
  );
}

// export the application object
export default app;
