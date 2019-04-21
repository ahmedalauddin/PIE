/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/kpiproject.js
 * Created:  2019-02-21 11:03:04
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-24 22:21:44
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} PersonProjects start definition`);
  var ProjectPersons = sequelize.define(
    "ProjectPersons",
    {
      owner: {
        type: DataTypes.TINYINT,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
      }
    },
    {
      tableName: "ProjectPersons",
      freezeTableName: true
    }
  );
  logger.debug(`${callerType} ProjectPersons end definition`);

  return ProjectPersons;
};
