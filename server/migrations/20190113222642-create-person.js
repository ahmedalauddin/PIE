/* jshint indent: 2 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    var Person = queryInterface.createTable('person', {
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
      }, /*
      orgId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Organization',
          key: 'id',
          as: 'orgId'
        }
      }, */
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    /*
    queryInterface.sequelize.query("ALTER TABLE person ADD CONSTRAINT fk_person_organization_orgid"
        + "FOREIGN KEY (orgId)"
        + "REFERENCES organization (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;");
    */

    /*
    Person.associate = (models) => {
      Person.belongsTo(models.Organization, {
        foreignKey: 'orgId',
        onDelete: 'cascade'
      });
    };*/



    return Person;
  },
  down: (queryInterface/* , Sequelize */) => {
    return queryInterface.dropTable('person');
  }
};


