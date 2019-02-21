/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/organization.js
 * Created:  2019-01-27 17:42:16
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-21 09:41:29
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Organization start definition`);
  var Organization = sequelize.define(
    "Organization",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      owningOrg: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: "Organizations"
    }
  );

  Organization.associate = models => {
    logger.debug(`${callerType} Organization hasMany Person`);
    Organization.hasMany(models.Person, {
      foreignKey: "orgId",
      as: "Persons"
    });
    logger.debug(`${callerType} Organization hasMany Project`);
    Organization.hasMany(models.Project, {
      foreignKey: "orgId",
      as: "Projects"
    });
    logger.debug(`${callerType} Organization hasMany Kpi`);
    Organization.hasMany(models.Kpi, {
      foreignKey: "orgId",
      as: "Kpis"
    });
    logger.debug(`${callerType} Organization hasOne Mindmap`);
    Organization.hasOne(models.Mindmap, {
      foreignKey: "orgId",
      as: "Mindmaps"
    });
  };

  return Organization;
};
