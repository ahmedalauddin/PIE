const Person = require('../models').Person;
const Organization = require('../models').Organization;

module.exports = {
    create: function (req, res) {
        return Person
            .create({
                username: req.body.username,
                fullName: req.body.fullName,
                email: req.body.email,
                orgId: req.body.orgId,
                createdAt: req.body.createdAt,
                updatedAt: req.body.updatedAt
            })
            .then(person => res.status(201).send(person))
            .catch(error => res.status(400).send(error));
    },

    list(req, res) {
        return Person
            .findAll({
                include: [{
                    model: Organization,
                    as: 'Organization',
                }],
            })
            .then(person => res.status(200).send(person))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },
};