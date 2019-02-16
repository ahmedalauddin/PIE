const Organization = require('../models').default.Organization;
const Mindmap = require('../models').default.Mindmap;
//TODO determine means to handle nodes of mindmap creating/updating/deleting projects

module.exports = {
    create(req, res) {
        return Mindmap
            .create({
                orgId: req.body.orgId,
                mapData: req.body.mapData
            })
            .then(mindmap => res.status(201).send(mindmap))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error)
            });
    },

    // Update a mindmap
    update(req, res) {
        const id = req.params.id;
        return Mindmap
            .update({
                mapData: req.body.mapData
            }, {
                returning: true,
                where: {
                    id: id
                }
            }).then(mindmap => res.status(200).send(mindmap))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error)
            });
    },

    // Delete a mindmap
    delete(req, res) {
        const id = req.params.id;
        return Mindmap
            .destroy({
                where: {
                    id: id
                }
            }).success(deletedCount => res.status(200).send(deletedCount))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error)
            });
    },

    // Find a mindmap by id
    findById(req, res) {
        return Mindmap
            .findById(req.params.id)
            .then(mindmap => res.status(200).send(mindmap))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error)
            });
    },

    // Find by organization
    findByOrgId(req, res) {
        const orgId = req.params.orgId;
        return Mindmap
            .findAll({
                where: {
                    orgId: orgId
                }
            })
            .then(mindmap => res.status(200).send(mindmap))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },

    // FInd all mindmaps
    list(req, res) {
        return Mindmap
            .findAll({
                include: [{
                    model: Mindmap,
                    as: 'Mindmap',
                }],
            })
            .then(mindmap => res.status(200).send(mindmap))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },
};