/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/person.js
 * Created:  2019-01-30 11:33:14
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-21 04:05:45
 * Editor:   Darrin Tisdale
 */
"use strict";

const logger = require("../util/logger")(__filename);
const callerType = "model";

// export
module.exports = (sequelize, DataTypes) => {
  logger.debug(`${callerType} Person start definition`);
  var Person = sequelize.define(
    "Person",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
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
      pwdhash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastLogin: {
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
      tableName: "Persons"
    }
  );
  logger.debug(`${callerType} Person end definition`);

  Person.associate = models => {
    Person.belongsTo(models.Organization, {
      foreignKey: "orgId",
      onDelete: "cascade"
    });
    logger.debug(`${callerType} Person belongsTo Organization`);
  };

  return Person;
};
