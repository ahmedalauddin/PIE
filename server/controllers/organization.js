const Organization = require('../models').Organization;
const Person = require('../models').Person;
const Project = require('../models').Project;
const Kpi = require('../models').Kpi;

module.exports = {
    create(req, res) {
        return Organization
            .create({
                name: req.body.name,
                owningOrg: req.body.owningOrg,
            })
            .then(organization => res.status(201).send(organization))
            .catch(error => res.status(400).send(error));
    },
    list(req, res) {
        return Organization
            .findAll({
                include: [{
                    model: Person,
                    as: 'Persons',
                }, {
                    model: Project,
                    as: 'Projects',
                }, {
                    model: Kpi,
                    as: 'Kpis',
                }],
                order: [
                    ['name', 'ASC'],
                ],
            })
            .then(organization => res.status(200).send(organization))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },
    // Find an org by Id
    findById(req, res) {
        return Organization
            .findById(req.params.id)
            .then(organization => res.status(200).send(organization))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },
    // Find an org by Name
    findByName(req, res) {
        console.log('name is: ' + req.params.name);
        return Organization
            .findOne({where: {name: req.params.name}})
            .then(organization => res.status(200).send(organization))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },
};




/*
// search for attributes
Sequelize.fn('lower', Sequelize.col('username')), sequelize.fn('lower', username)
})



where:
    sequelize.fn('lower', Sequelize.col('name')),
        sequelize.fn('lower', req.body.name)
})

*/