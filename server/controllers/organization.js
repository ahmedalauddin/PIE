const Organization = require('../models').Organization;
const Person = require('../models').Person;

module.exports = {
    create(req, res) {
        return Organization
            .create({
                name: req.body.name,
                owningOrg: req.body.owningOrg,
                createdAt: req.body.createdAt,
                updatedAt: req.body.updatedAt
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
                }],
            })
            .then(organization => res.status(200).send(organization))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },
};