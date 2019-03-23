/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/task.js
 * Created:  2019-03-21 11:29:38
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-23
 * Editor:   Brad Kaufman
 */
"use strict";

// declarations
const models = require("../models");
const Task = require("../models").Task;
const Person = require("../models").Person;
const Project = require("../models").Project;
const util = require("util");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

module.exports = {
  create(req, res) {
    return models.Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      projectId: parseInt(req.body.projectId)
    })
      .then(t => {
        logger.debug(`${callerType} create -> added task, id: ${t.id}`);
        res.status(201).send(t);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a task
  update(req, res) {
    const id = req.params.id;
    logger.debug(
      `${callerType} update -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    return models.Task.update(
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(p => {
        logger.debug(`${callerType} update Task -> successful`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} update Task -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a task by Id
  findById(req, res) {
    return models.Task.findById(req.params.id, {
      include: [
        {
          model: Person,
          as: "person"
        }
      ]
    })
      .then(t => {
        logger.debug(`${callerType} findById -> id: ${t.id}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all tasks
  list(req, res) {
    logger.debug(`${callerType} list tasks -> start`);
    return models.Task.findAll({
      include: [
        {
          model: models.Person,
          as: "person"
        }
      ],
      order: [["title", "ASC"]]
    })
      .then(tasks => {
        logger.debug(`${callerType} list -> count: ${tasks.length}`);
        res.status(200).send(tasks);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
