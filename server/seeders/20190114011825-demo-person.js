'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('person', [{
      username: 'darrintisdale',
      fullName: 'Darrin Tisdale',
      email: 'darrin@thoughtive.io'
    }, {
      username: 'bradkaufman',
      fullName: 'Brad Kaufman',
      email: 'brad@thoughtive.io'
    }, {
      username: 'tomjones',
      fullName: 'Tom Jones',
      email: 'tomjones@thoughtive.io'
    }, {
      username: 'alauddinahmed',
      fullName: 'Alauddin Ahmed',
      email: 'alauddinahmed@value-infinfinity.com'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('person', null, {});
  }
};
