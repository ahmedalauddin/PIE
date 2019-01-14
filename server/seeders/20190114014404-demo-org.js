'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('organization', [{
      name: 'ValueInfinity',
      owningOrg: true
    }, {
      name: 'Thoughtive',
      owningOrg: false
    }, {
      name: 'Diamond Wind Turbine',
      owningOrg: false
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('organization', null, {});
  }
};
