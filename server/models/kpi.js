/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/kpi.js
 * Created:  2019-01-27 13:44:17
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-21 09:43:25
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Kpi start definition`);
  var Kpi = sequelize.define(
    "Kpi",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        references: {
          table: "Organizations",
          key: "id"
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: "Kpis"
    }
  );
  logger.debug(`${callerType} Kpi end definition`);

  Kpi.associate = models => {
    logger.debug(`${callerType} Kpi belongsTo Organization`);
    Kpi.belongsTo(models.Organization, {
      as: "Organization",
      foreignKey: "orgId",
      onDelete: "cascade"
    });
  };

  return Kpi;
};
