/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/kpi.js
 * Created:  2019-01-27 13:43:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-21 10:02:42
 * Editor:   Darrin Tisdale
 */
"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const Organization = require("../models").Organization;
const callerType = "controller";

module.exports = {

  create(req, res) {
    const projectId = req.body.projectId;
    logger.debug(`${callerType} create -> projectId: ${projectId}`);
    logger.debug(`${callerType} create -> JSON: req.body: ${JSON.stringify(req.body)}`);
    return models.Kpi.create({
      title: req.body.title,
      description: req.body.description,
      formulaDescription: req.body.formula,
      type: req.body.type,
      level: req.body.level,
      status: req.body.taskstatus,
      orgId: req.body.orgId
    })
      .then(k => {
        logger.debug(`${callerType} create -> added kpi, id: ${k.id}`);
        // SQL to insert all people from the org into the ProjectPersons table with
        // the project id.
        let kpiId = k.id;
        let sql = "INSERT into `KpiProjects` " +
          "(projectId, KpiId)  " +
          "values (" + projectId + ", " + kpiId + ")";
        logger.debug(`${callerType} create KpiProject -> sql: ${sql}`);
        return models.sequelize.query(sql);
      })
      .then(() => {
        res.status(201).send();
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a Kpi
  update(req, res) {
    const id = req.params.id;
    return models.Kpi.update(
      {
        title: req.body.title,
        description: req.body.description,
        formulaDescription: req.body.formula,
        type: req.body.type,
        level: req.body.level,
        status: req.body.taskstatus,
        orgId: req.body.orgId
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(_k => {
        logger.debug(`${callerType} update -> successful`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a Kpi by Id
  findById(req, res) {
    logger.error(`${callerType} KPI, findById `);
    return models.Kpi.findByPk(req.params.id, {
      include: [
        {
          model: models.Organization,
          as: "organization"
        },
        {
          model: models.Department,
          as: "department"
        }
      ]
    })
      .then(_k => {
        logger.debug(
          `${callerType} findById -> successful, title: ${_k.title}`
        );
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },


  // List all KPIs for a single project
  listByProject(req, res) {
    // Important note, but the where clause is used with the included model Project.  See the example
    // here, http://docs.sequelizejs.com/manual/associations.html#belongs-to-many-associations, for
    // User.findAll.
    return models.Kpi.findAll({
      order: [["title", "DESC"]],
      include: [
        {
          model: Organization,
          as: "organization"
        },
        {
          model: models.Project,
          where: { id: req.params.projid },
          as: "project"
        },
        {
          model: models.Department,
          as: "department"
        }
      ]
    })
      .then(_k => {
        logger.debug(`${callerType} listByProject -> successful, count: ${_k.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} listByProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all KPIs
  list(req, res) {
    return models.Kpi.findAll({
      include: [
        {
          model: models.Organization,
          as: "organization"
        }
      ]
    })
      .then(_k => {
        logger.debug(`${callerType} list -> successful, count: ${_k.length}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }

};
