/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/task.js
 * Created:  2019-02-21 11:03:04
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-21 23:05:13
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Task start definition`);
  var Task = sequelize.define(
    "Task",
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
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // projectId: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     table: "Projects",
      //     key: "id"
      //   }
      // },
      assignedTo: {
        type: DataTypes.INTEGER,
        references: {
           table: "Persons",
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
      tableName: "Tasks"
    }
  );
  logger.debug(`${callerType} Task end definition`);

  Task.associate = models => {
    logger.debug(`${callerType} Task belongsTo Project`);
    Task.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projectId",
      onDelete: "cascade"
    });

    logger.debug(`${callerType} Task belongsTo Person`);
    Task.belongsTo(models.Person, {
      as: "assigned",
      foreignKey: "assignedTo",
      onDelete: "cascade"
    });
  };

  return Task;
};
