/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/milestone.js
 * Descr:    Sequelize controller for milestone.
 * Created:  2019-05-12
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-22
 * Editor:   Brad Kaufman
 */
"use strict";

// declarations
const models = require("../models");
const Project = require("../models").Project;
const Task = require("../models").Task;
const Person = require("../models").Person;
const TaskStatus = require("../models").TaskStatus;
const TaskPriority = require("../models").TaskPriority;
const util = require("util");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

module.exports = {
  create(req, res) {
    logger.debug(
      `${callerType} update -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    return models.Milestone.create({
      title: req.body.title,
      description: req.body.description,
      statusId: req.body.statusId,
      orgId: req.body.orgId,
      targetDate: req.body.targetDate,
      projectId: parseInt(req.body.projectId),
      projectStartAt: new Date(req.body.projectStartAt),
      projectEndAt: new Date(req.body.projectEndAt)
    })
      .then(t => {
        logger.debug(`${callerType} create -> added Milestone, id: ${t.id}`);
        res.status(201).send(t);
      })
      .catch(error => {
        // Would like to handle the constraint error from the database if the milestone falls outside of the project
        // start and end date: "check constraint on Projects.startAt failed".  In the meantime, just assume
        // this is the error when we get a 400 code response.
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
        statusId: req.body.statusId,
        orgId: req.body.orgId,
        targetDate: req.body.targetDate,
        projectId: parseInt(req.body.projectId)
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
        {
          model: TaskStatus,
          as: "status"
        }
      ]
    })
      .then(t => {
        logger.debug(`${callerType} Milestone findById -> id: ${t.id}`);
        res.status(200).send(t);
      })
      .catch(error => {
        logger.error(`${callerType} Milestone findById -> error: ${error.stack}`);
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
          model: Project,
          as: "project"
        },
        {
          model: models.Task,
          as: "tasks",
          include: [
            {
              model: TaskStatus,
              as: "status"
            },
            {
              model: TaskPriority,
              as: "priority"
            },
            {
              model: Person,
              as: "assigned"
            }
          ]
        },
        {
          model: TaskStatus,
          as: "status"
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
  },

  // Save a Gantt chart
  saveGantt(req, res) {
    const projectId = req.body.projectId;
    const jsonData = req.body.jsonData;
    const sql = "update Gantt set jsonData = '" + jsonData + "' where projectId = " + projectId + ";";
    logger.debug(
      `${callerType} saveGantt -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    logger.debug(
      `${callerType} saveGantt -> sql: ${sql}`
    );
    return models.sequelize.query(sql, {
      type: models.sequelize.QueryTypes.RAW
    })
      .then(gantt => {
        logger.debug(`${callerType} Milestone saveGantt -> successful`);
        res.status(201).send(gantt);
      })
      .catch(error => {
        logger.error(`${callerType} Milestone saveGantt -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Save a Gantt chart
  createGantt(req, res) {
    const projectId = req.body.projectId;
    const orgId = req.body.orgId;
    const jsonData = req.body.jsonData;
    const sql = "insert into Gantt (orgId, projectId, jsonData) values (" + orgId + ", " + projectId +
      ", '" + jsonData + "')";
    logger.debug(`createGantt -> sql: ${sql}`);
    return models.sequelize.query(sql, {
      type: models.sequelize.QueryTypes.RAW
    })
      .then(gantt => {
        logger.debug(`${callerType} Milestone saveGantt -> successful`);
        res.status(201).send(gantt);
      })
      .catch(error => {
        logger.error(`${callerType} Milestone saveGantt -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all milestones for a single project for our Gantt chart.
  listForGantt(req, res) {
    const projectId = req.params.projid;
    /*
    const sql = "select t.id, t.title as text, t.startDate as start_date, t.endDate as end_date, " +
      "'task' as type, t.milestoneId as parent, datediff(t.endDate, t.startDate)  as duration " +
      "from Tasks t where t.projectId = " + projectId + " and t.milestoneId is not null " +
      "union select m.id, m.title as text, m.startDate as start_date, m.targetDate as end_date, " +
      "'milestone' as type, null as parent, null as duration " +
      "from Milestones m where m.projectId = " + projectId + " " +
      "order by parent, start_date, end_date;";    */
    const sql = "select jsonData from Gantt where projectId = " + projectId;

    return models.sequelize.query(
      sql, {
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(milestones => {
        logger.debug(`${callerType} Milestone listForGantt -> successful, count: ${milestones.length}`);
        res.status(201).send(milestones);
      })
      .catch(error => {
        logger.error(`${callerType} Milestone listForGantt -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
