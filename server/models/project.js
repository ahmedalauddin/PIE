/**
 * Project:  valueinfinity-mvp
 * File:     /server/models/project.js
 * Created:  2019-01-30 11:33:14
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-18 16:16:37
 * Editor:   Darrin Tisdale
 */

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
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
          table: "organization",
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

  Project.associate = models => {
    Project.belongsTo(models.Organization, {
      foreignKey: "orgId",
      onDelete: "cascade"
    });
  };

  return Project;
};
