/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Organization = sequelize.define(
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
    Organization.hasMany(models.Person, {
      foreignKey: "orgId",
      as: "Persons"
    });
    Organization.hasMany(models.Project, {
      foreignKey: "orgId",
      as: "Projects"
    });
    Organization.hasMany(models.Kpi, {
      foreignKey: "orgId",
      as: "Kpis"
    });
    Organization.hasMany(models.Mindmap, {
      foreignKey: "orgId",
      as: "Mindmaps"
    });
  };

  return Organization;
};
