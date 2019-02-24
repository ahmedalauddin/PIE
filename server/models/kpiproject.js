/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/kpiproject.js
 * Created:  2019-02-21 11:03:04
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-21 23:22:20
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} KpiProjects start definition`);
  var KpiProject = sequelize.define(
    "KpiProject",
    {
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "KpiProjects"
    }
  );
  logger.debug(`${callerType} KpiProjects end definition`);

  return KpiProject;
};
