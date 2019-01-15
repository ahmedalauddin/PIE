'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('organization', [{
      name: 'ValueInfinity',
      id: 1,
      owningOrg: true
    }, {
      name: 'Thoughtive',
      id: 2,
      owningOrg: false
    }, {
      name: 'Diamond Wind Turbine',
      id: 3,
      owningOrg: false
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('organization', null, {});
  }
};
