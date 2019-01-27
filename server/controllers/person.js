const Person = require('../models').Person;
const Organization = require('../models').Organization;

module.exports = {
    create(req, res) {
        return Person
            .create({
                username: req.body.username,
                fullName: req.body.fullName,
                email: req.body.email,
                orgId: req.body.orgId,
            })
            .then(person => res.status(201).send(person))
            .catch(error => res.status(400).send(error));
    },

    // Update a person
    update(req, res) {
        const id = req.params.id;
        return Person
            .update({
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                orgId: req.body.orgId,
            },
            {returning: true, where: {id: id}}
            ).then(person => res.status(200).send(person))
            .catch(error => res.status(400).send(error));
    },


    // Find a person by Id
    findById(req, res) {
        return Person
            .findById(req.params.id)
            .then(person => res.status(200).send(person))
            .catch(error => res.status(400).send(error));
    },

    // List all persons
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