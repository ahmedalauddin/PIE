'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('person', [{
      username: 'darrintisdale',
      fullName: 'Darrin Tisdale',
      orgId: 2,
      email: 'darrin@thoughtive.io'
    }, {
      username: 'bradkaufman',
      fullName: 'Brad Kaufman',
      orgId: 2,
      email: 'brad@thoughtive.io'
    }, {
      username: 'alauddinahmed',
      fullName: 'Alauddin Ahmed',
      orgId: 1,
      email: 'alauddinahmed@value-infinfinity.com'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('person', null, {});
  }
};
