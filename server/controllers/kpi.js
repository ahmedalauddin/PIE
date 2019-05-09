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
    let kpiId = null;
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
        kpiId = k.id;
        let sql = "INSERT into `KpiProjects` " +
          "(projectId, KpiId)  " +
          "values (" + projectId + ", " + kpiId + ")";
        logger.debug(`${callerType} create KpiProject -> sql: ${sql}`);
        return models.sequelize.query(sql);
      })
      .then(() => {
        // SQL to insert all tags.  Need to loop through the array of tags to build the strings of values
        // we'll insert.
        let tags = req.body.tags;
        let tag = "";
        if (tags.length > 0) {
          let valueStr = "";
          for (let i = 0; i < tags.length; i++) {
            tag = tags[i].text;
            valueStr += "(" + kpiId.toString() + ", '" + tag + "')";
            if (i < (tags.length-1)) {
              valueStr += ",";
            }
          }
          let sql =
            "INSERT into `KpiTags` (kpiId, tag) " +
            "values " + valueStr + " " +
            "ON DUPLICATE KEY UPDATE kpiId=" + kpiId;
          logger.debug(`${callerType} insert KpiTags -> sql: ${sql}`);
          return models.sequelize.query(sql);
        }
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
        },
        {
          model: models.Project,
          as: "project"
        },
        {
          model: models.KpiTag,
          as: "tags"
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

  // Search KPIs
  search(req, res) {
    // TODO - add searching against view, which includes tags.
    /*
    select * from vw_Kpis where (tags like '%anal%' or title like '%anal%'
                or description like '%anal%');
     */

    logger.error(`${callerType} KPI, search `);
    let searchText = req.params.text;
    let sql = "select K.*, KT.*, P.title as projectTitle, O.name as orgName " +
      "from Projects P, Organizations O, KpiProjects KP, Kpis K " +
      "left outer join KpiTags KT on K.id = KT.kpiId " +
      "where (KT.tag like '%" + searchText + "%' or K.title like '%" + searchText + "%' " +
      "or K.description like '%" + searchText + "%') " +
      "and K.id = KP.kpiId and " +
      "KP.projectId = P.id and P.orgId = O.id";
    logger.debug(`${callerType} create KpiProject -> sql: ${sql}`);
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(_k => {
        logger.debug(
          `${callerType} KPI search -> successful, title: ${_k.title}`
        );
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} KPI search -> error: ${error.stack}`);
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
        },
        {
          model: models.KpiTag,
          as: "tags"
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
