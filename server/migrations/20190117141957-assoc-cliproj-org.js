'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const ClientProject = queryInterface.addColumn('clientproject', 'orgId', {
            type: Sequelize.INTEGER
        });

        queryInterface.addConstraint('clientproject', ['orgId'], {
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
            var ClientProject = require('../models').ClientProject;
        }
    };
