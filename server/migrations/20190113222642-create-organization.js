/* jshint indent: 2 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    var Organization = queryInterface.createTable('organization', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      owningOrg: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    /*
    Organization.associate = (models) => {
      Organization.hasMany(models.Persons, {
        foreignKey: 'orgId',
        as: 'persons'
      });
    }; */

    return Organization;
  },
  down: (queryInterface/*, Sequelize */) => {
    return queryInterface.dropTable('organization');
  }
};

