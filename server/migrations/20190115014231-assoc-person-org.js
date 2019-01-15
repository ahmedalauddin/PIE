'use strict';

module.exports = {
    up: (queryInterface , Sequelize) => {
        const Person = queryInterface.addColumn('person', 'orgId', {
            type: Sequelize.INTEGER
        });

        queryInterface.addConstraint('person', ['orgId'], {
            type: 'foreign key',
            name: 'fk_orgid_person_org',
            references: {
                table: 'organization',
                field: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        });

        return Person;
    },

    down: (sequelize, Sequelize) => {
        var Person = require('../models').Person;
    }
};
