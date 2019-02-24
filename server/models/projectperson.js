/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/kpiproject.js
 * Created:  2019-02-21 11:03:04
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-21 23:37:32
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
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP()")
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal(
          "CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()"
        )
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
