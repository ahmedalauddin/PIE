/* jshint indent: 2 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('person', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      orgId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Organization',
          key: 'id',
          as: 'orgId'
        }
      }
    });
  },
  down: (queryInterface/* , Sequelize */) => {
    return queryInterface.dropTable('person');
  }
};


