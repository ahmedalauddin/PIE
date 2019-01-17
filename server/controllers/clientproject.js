const ClientProject = require('../models').ClientProject;
const Organization = require('../models').Organization;

module.exports = {
    create: function (req, res) {
        return ClientProject
            .create({
                name: req.body.name,
                description: req.body.description,
                businessGoal: req.body.businessGoal,
                orgId: req.body.orgId,
                progress: req.body.progress,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                createdAt: req.body.createdAt,
                updatedAt: req.body.updatedAt
            })
            .then(clientproject => res.status(201).send(clientproject))
            .catch(error => res.status(400).send(error));
    },

    list(req, res) {
        return ClientProject
            .findAll({
                include: [{
                    model: Organization,
                    as: 'Organization',
                }],
            })
            .then(clientproject => res.status(200).send(clientproject))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },
};