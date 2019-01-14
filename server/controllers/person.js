const Person = require('../models').Person;

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
            .all()
            .then(person => res.status(200).send(person))
            .catch(error => res.status(400).send(error));
    },
};