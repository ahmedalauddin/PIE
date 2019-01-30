'use strict';

module.exports = {
  up: (queryInterface , Sequelize) => {
    const ClientProject = queryInterface.addConstraint('clientproject', ['orgId'], {
      type: 'foreign key',
      name: 'fk_orgid_clientproject_org',
      references: {
        table: 'organization',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    return ClientProject;
  },

  down: (sequelize, Sequelize) => {
    var Person = require('../server/models').ClientProject;
  }
};
