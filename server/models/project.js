/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/project.js
 * Created:  2019-01-30 11:33:14
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-21 09:36:00
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Project start definition`);
  var Project = sequelize.define(
    "Project",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        references: {
          table: "Organizations",
          key: "id"
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessGoal: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mindmapId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      nodeId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      startAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      endAt: {
        type: DataTypes.DATE,
        allowNull: true
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
      tableName: "Projects"
    }
  );
  logger.debug(`${callerType} Person end definition`);

  Project.associate = models => {
    Project.belongsTo(models.Organization, {
      foreignKey: "orgId",
      onDelete: "cascade"
    });
    logger.debug(`${callerType} Project belongsTo Organization`);
  };

  return Project;
};
