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
const Project = require("../models").Project;
const callerType = "model";


function checkTargetDate(milestone, options, callback) {
  // TODO - need to validate against project start and end dates.
  console.log("Milestone: checkTargetDate -- project ID ", milestone.projectId);
  let project = Project.findByPk(milestone.projectId)
    .then(project => {
      console.log("got project, startAt = ", project.startAt);
      return project;
    });
  console.log("Milestone checkTargetDate: startAt = ", project.startAt)
  return "success";
};

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
      tableName: "Milestones",
      hooks: {
        beforeValidate: (milestone, options, callback) => {

        },
        afterValidate: () => {
          console.log("Milestone: afterValidate");
        },
        beforeCreate: (milestone, options, callback) => {
          console.log("Milestone: beforeCreate");
          console.log("Milestone: beforeCreate -- title ", milestone.title, ", project ID ", milestone.projectId);
          checkTargetDate(milestone, options, callback);
          return callback(null, options);
        },
        afterCreate: (res) => {
          console.log("Milestone: afterCreate: Created milestone with target date ", res.dataValues.targetDate);
        },
        beforeUpdate: () => {
          console.log("Milestone: beforeCreate");
        },
        afterUpdate: () => {
          console.log("Milestone: afterUpdate");
        }
      }
    }
  );
  logger.debug(`${callerType} Milestone end definition`);

  logger.debug(`${callerType} Milestone start associations`);
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
  logger.debug(`${callerType} Milestone end associations`);

  return Milestone;
};
