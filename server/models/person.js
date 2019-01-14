/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define('Person', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  }, {
    tableName: 'person'
  });
/*
  Person.associate = (models) => {
    Person.belongsTo(models.Organization, {
      foreignKey: 'orgId',
      onDelete: 'cascade'
    });
  };*/

  return Person;
};

