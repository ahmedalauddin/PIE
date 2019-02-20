/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/index.js
 * Created:  2019-01-27 13:43:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-20 15:27:11
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const config = require("../config/config");
const fs = require("fs");
const Sequelize = require("sequelize");
const logger = require("../util/logger")(__filename);
const path = require("path");
const db = {};
const callerType = "model";

// get configuration variables
let _d = config.get("db.name");
let _u = config.get("db.user");
let _p = config.get("db.password");
let _h = config.get("db.host");
let _l = config.get("db.dialect");

// connect to the db
let sequelize = new Sequelize(_d, _u, _p, { _h, _l });

// connect
sequelize
  .authenticate()
  .then(() => {
    logger.info(`${callerType} -> connection to ${_d} as ${_u} successful`);

    // read the models into sequelize
    fs.readdirSync(__dirname)
      .filter(file => {
        return (
          file.indexOf(".") !== 0 &&
          file !== path.basename(__filename) &&
          path.extname(file) === ".js"
        );
      })
      .forEach(file => {
        let _m = path.join(__dirname, file);
        let model = sequelize["import"](_m);
        logger.debug(`${callerType} -> found ${_m}`);
        db[model.name] = model;
      });

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
        logger.debug(`${callerType} -> associated ${modelName} model with db`);
      }
    });
  })
  .catch(error => {
    logger.error(`${callerType} error occurred: ${error.stack}`);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
