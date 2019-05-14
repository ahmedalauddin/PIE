/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/milestone.js
 * Descr:    Sequelize model for Milestones
 * Created:  2019-05-14
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Milestone start definition`);
  var Milestone = sequelize.define(
    "Milestone",
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
      targetDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: true
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
      tableName: "Milestones"
    }
  );
  logger.debug(`${callerType} Milestone end definition`);

  Milestone.associate = models => {
    logger.debug(`${callerType} Milestone belongsTo Project`);
    Milestone.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projectId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Milestone belongsTo TaskStatus`);
    Milestone.belongsTo(models.TaskStatus, {
      as: "status",
      foreignKey: "statusId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Milestone hasMany Task`);
    Milestone.hasMany(models.Task, {
      as: "tasks",
      foreignKey: "milestoneId"
    });
  };

  return Milestone;
};
