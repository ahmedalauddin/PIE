const Organization = require('../models').Organization;
const Project = require('../models').Project;
const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');

module.exports = {
    create(req, res) {
        console.log("dump object: " + util.inspect(req, {showHidden: false, depth: null}));

        return Project
            .create({
                title: req.body.title,
                description: req.body.description,
                orgId: parseInt(req.body.orgId),
                businessGoal: req.body.businessGoal,
                orgId: req.body.orgId,
                mindmapId: req.body.mindmapId,
                nodeId: req.body.nodeId,
                progress: parseInt(req.body.progress),
                startAt: req.params.startDate,
                endAt: req.params.endDate,
            })
            .then(p => res.status(201).send(p))
            .catch(error => res.status(400).send(error));
    },
    //businessGoal: req.body.businessGoal,
    //orgId: req.body.orgId,
    //mindmapId: req.body.mindmapId,
    //nodeId: req.body.nodeId,
    // Update a project
    update(req, res) {
        const id = req.params.id;
        return Project
            .update({
                    title: req.body.title,
                    description: req.body.description,
                    businessGoal: req.body.businessGoal,
                    orgId: req.body.orgId,
                    mindmapId: req.body.mindmapId,
                    nodeId: req.body.mindmapId,
                    progress: req.body.progress,
                    startAt: req.body.startAt,
                    endAt: req.body.endAt,
                    createdAt: req.body.createdAt,
                    updatedAt: req.body.updatedAt
                },
                {returning: true, where: {id: id}}
            ).then(p => res.status(200).send(p))
            .catch(error => res.status(400).send(error));
    },


    // Find a project by id
    findById(req, res) {
        return Project
            .findById(req.params.id, {
                include: [{
                    model: Organization,
                    as: 'Organization',
                }],
            })
            .then(p => res.status(200).send(p))
            .catch(error => res.status(400).send(error));
    },

    // FInd all projects
    list(req, res) {
        return Project
            .findAll({
                include: [{
                    model: Organization,
                    as: 'Organization',
                }],
            })
            .then(p => res.status(200).send(p))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },
};