/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/milestone.js
 * Created:  2019-05-12
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declarations
const models = require("../models");
const Project = require("../models").Project;
const Task = require("../models").Task;
const TaskStatus = require("../models").TaskStatus;
const util = require("util");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

module.exports = {
  create(req, res) {
    return models.Milestone.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.taskstatus,
      projectId: parseInt(req.body.projectId)
    })
      .then(t => {
        logger.debug(`${callerType} create -> added Milestone, id: ${t.id}`);
        res.status(201).send(t);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a milestone
  update(req, res) {
    const id = req.params.id;
    logger.debug(
      `${callerType} update -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    return models.Milestone.update(
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.taskstatus
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(p => {
        logger.debug(`${callerType} update Milestone -> successful`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} update Milestone -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a milestone by Id
  findById(req, res) {
    return models.Milestone.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: "project"
        },
        {
          model: Task,
          as: "tasks"
        },

      ]
    })
      .then(t => {
        logger.debug(`${callerType} findById -> id: ${t.id}`);
        res.status(200).send(t);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all milestones for a single project
  listByProject(req, res) {
    return models.Milestone.findAll({
      where: { projectId: req.params.projid },
      order: [["targetDate", "ASC"]],
      include: [
        {
          model: models.Task,
          as: "tasks"
        }
      ]
    })
      .then(milestones => {
        logger.debug(`${callerType} Milestone listByProject -> successful, count: ${milestones.length}`);
        res.status(201).send(milestones);
      })
      .catch(error => {
        logger.error(`${callerType} Milestone listByProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
