/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/dataset.js
 * Created:  2019-02-21 11:03:04
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-21 23:01:50
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} DataSource start definition`);
  var DataSet = sequelize.define(
    "DataSet",
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
      sourceFile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // dataSourceId: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     table: "DataSources",
      //     key: "id"
      //   }
      // },
      // projectId: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     table: "Projects",
      //     key: "id"
      //   }
      // },
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
      tableName: "DataSets"
    }
  );
  logger.debug(`${callerType} DataSet end definition`);

  DataSet.associate = models => {
    logger.debug(`${callerType} DataSet belongsTo Project`);
    DataSet.belongsTo(models.Project, {
      as: "project",
      foreignKey: "projectId",
      onDelete: "cascade"
    });
    logger.debug(`${callerType} DataSet belongsTo DataSource`);
    DataSet.belongsTo(models.DataSource, {
      as: "dataSource",
      foreignKey: "dataSourceId",
      onDelete: "cascade"
    });
  };

  return DataSet;
};
