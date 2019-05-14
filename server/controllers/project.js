/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/project.js
 * Created:  2019-02-01 12:39:20
 * Author:   Darrin Tisdale
 * Descr:    Sequelize controller for projects.
 * -----
 * Modified: 2019-02-26 17:57:47
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const Organization = require("../models").Organization;
const Project = require("../models").Project;
const KPI = require("../models").Kpi;
const Task = require("../models").Task;
const Person = require("../models").Person;
const models = require("../models");
const logger = require("../util/logger")(__filename);
const util = require("util");
const callerType = "controller";

module.exports = {
  // Creates a project in the Project table, then inserts into ProjectPersons, setting its
  // `inProject` flag to false for all people.
  create(req, res) {
    let _obj = util.inspect(req, { showHidden: false, depth: null });
    logger.debug(`${callerType} create -> request: ${_obj}`);
    return Project.create({
      title: req.body.title,
      description: req.body.description,
      orgId: parseInt(req.body.orgId),
      mainKpiId: req.body.mainKpiId,
      businessGoal: req.body.businessGoal,
      mindmapId: req.body.mindmapId,
      nodeId: req.body.nodeId,
      progress: parseInt(req.body.progress),
      startAt: req.params.startDate,
      endAt: req.params.endDate
    })
      .then(p => {
        // SQL to insert all people from the org into the ProjectPersons table with
        // the project id.
        let projectId = p.id;
        let sql = "INSERT into `ProjectPersons` " +
          "(personId, projectId, owner, inProject)  " +
          "Select Pe.id, " + projectId + ", 0, 0 from Organizations O, Projects P, Persons Pe  " +
          "where O.id = P.orgId and Pe.orgId = O.id and P.id = " + projectId + " " +
          "ON DUPLICATE KEY UPDATE personId=values(personId)";
        logger.debug(`${callerType} update ProjectPerson -> sql: ${sql}`);

        return models.sequelize.query(sql);
      })
      .then(p => {
        logger.info(`${callerType} create -> successful, id: ${p.id}`);
        res.status(201).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a project
  update(req, res) {
    if (req.query.mmid && req.query.nid) {
      let _obj = util.inspect(req, { showHidden: false, depth: null });
      logger.debug(`${callerType} updateByMindMapNode -> request: ${_obj}`);
      return Project.update(
        {
          title: req.body.title,
          description: req.body.description,
          businessGoal: req.body.businessGoal,
          mainKpiId: req.body.mainKpiId,
          progress: req.body.progress,
          startAt: req.body.startAt,
          endAt: req.body.endAt
        },
        {
          returning: true,
          where: {
            mindmapId: parseInt(req.body.mmid),
            nodeId: parseInt(req.body.nid)
          }
        }
      )
        .then(p => {
          logger.info(`${callerType} updateByMindMapNode -> 
          successful, id: ${p.id}`);
          res.status(200).send(p);
        })
        .catch(error => {
          logger.error(`${callerType} updateByMindMapNode -> 
          error: ${error.stack}`);
          res.status(400).send(error);
        });
    } else {
      let _obj = util.inspect(req, { showHidden: false, depth: null });
      logger.debug(`${callerType} update -> request: ${_obj}`);
      let _id = parseInt(req.body.id);
      return Project.update(
        {
          title: req.body.title,
          description: req.body.description,
          businessGoal: req.body.businessGoal,
          mainKpiId: req.body.mainKpiId,
          progress: req.body.progress,
          startAt: req.body.startAt,
          endAt: req.body.endAt
        },
        {
          returning: true,
          where: { id: _id }
        }
      )
        .then(p => {
          logger.info(`${callerType} update -> successful, id: ${p.id}`);
          res.status(200).send(p);
        })
        .catch(error => {
          logger.error(`${callerType} update -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }
  },

  // find a project by id
  findById(req, res) {
    let _obj = util.inspect(req.body, { showHidden: false, depth: null });
    logger.debug(`${callerType} findById -> request: ${_obj}`);
    return Project.findByPk(req.params.id, {
      include: [
        {
          model: Organization,
          as: "organization"
        },
        {
          model: Task,
          as: "tasks"
        },
        /* {
          model: KPI,
          as: "mainKpi"
        }, */
        {
          model: KPI,
          as: "kpis"
        },
        {
          model: Person,
          as: "team"
        }
      ]
    })
      .then(p => {
        logger.info(`${callerType} findById -> successful, 
          title: ${p ? p.title : "not found"}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // destroy a project by id
  destroy(req, res) {
    if (req.query.mmid && req.query.nid) {
      logger.debug(
        `${callerType} findForMindMapNode -> 
          mmid: ${req.body.mmid}, nid: ${req.body.nid}`
      );
      return Project.destroy({
        where: {
          mindmapId: parseInt(req.body.mmid),
          nodeId: parseInt(req.body.nid)
        }
      })
        .then(p => {
          logger.info(`${callerType} destroyByMindMapNode -> 
          successful, count: ${p}`);
          res.status(200).send(p);
        })
        .catch(error => {
          logger.error(`${callerType} destroyByMindMapNode -> 
          error: ${error.stack}`);
          res.status(400).send(error);
        });
    } else {
      let _obj = util.inspect(req.body, { showHidden: false, depth: null });
      logger.debug(`${callerType} destroy -> request: ${_obj}`);
      return Project.destroy({
        where: { id: parseInt(req.body.id) }
      })
        .then(p => {
          logger.info(`${callerType} destroy -> successful, count: ${p}`);
          res.status(200).send(p);
        })
        .catch(error => {
          logger.error(`${callerType} destroy -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }
  },

  // Find an org by Id
  findByOrganization(req, res) {
    logger.debug(`${callerType} findByOrganization -> id = ${req.params.id}`);
    return models.sequelize
      .query(
        "select P.id, P.title, P.description, K.title as mainKpi " +
          "from Projects P left outer join Kpis K " +
          "on P.mainKpiId = K.id where P.orgId = " + req.params.orgid + " " +
          "order by P.title ",
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(org => {
        logger.info(`${callerType} findByOrganization -> returned`);
        res.status(200).send(org);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },

  // get projects by organization
  getProjectDashboard(req, res) {
    // TODO - need to pass in org id
    let sql = "select P.id, P.orgId, P.title as `projectTitle`, TS.label as `status`, K.title as `mainKpi`,\
      P.progress, P.startAt, P.endAt,(select group_concat(concat(' ', Per.firstName, ' ', Per.lastName)) from ProjectPersons PP, \
      Persons Per where P.id = PP.projectId and Per.id = PP.personId and PP.owner = '1') as owners, \
      (select group_concat(concat(' ', T.title)) from Tasks T where T.projectId = P.id) as tasks \
      from Projects P left outer join TaskStatuses TS on P.statusId = TS.id \
      left outer join Kpis K on P.mainKpiId = K.id  \
      where P.orgId = " + req.params.orgId + " order by P.title";
    return models.sequelize
      .query(sql,
        {
          type: models.sequelize.QueryTypes.SELECT,
          limit: 15
        }
      )
      .then(projects => {
        res.status(200).send(projects);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },

  // List most recent projects
  getMostRecent(req, res) {
    // SQL for most recent projects.
    return models.sequelize
      .query(
        "select id, title, description, startAt, ProjectUpdated, " +
          "    greatest(ProjectUpdated, COALESCE(TUdate, '2000-01-01'), " +
          "      COALESCE(TCdate, '2000-01-01'), COALESCE(KUdate, '2000-01-01'), " +
          "      COALESCE(KCdate, '2000-01-01')) as MostRecent from " +
          " (select  P.id as id, P.title, P.description, P.startAt, P.updatedAt as ProjectUpdated , " +
          "   (select max(T.updatedAt) from Tasks T where T.projectId = P.id) as TUdate, " +
          "   (select max(T.createdAt) from Tasks T where T.projectId = P.id) as TCdate, " +
          "   (select max(K.updatedAt) from Kpis K, KpiProjects KP where K.id = KP.kpiId " +
          "      and P.id = KP.projectId) as KUdate, " +
          "   (select max(K.createdAt) from Kpis K, KpiProjects KP where K.id = KP.kpiId " +
          "      and P.id = KP.projectId) as KCdate " +
          "   from Projects P) as Proj ",
        {
          type: models.sequelize.QueryTypes.SELECT,
          limit: 3,
          order: [["MostRecent", "DESC"]]
        }
      )
      .then(projects => {
        res.status(200).send(projects);
      })
      .catch(error => {
        logger.error(error.stack);
        res.status(400).send(error);
      });
  },

  // find all projects
  list(req, res) {
    if (req.query.mmid && req.query.nid) {
      logger.debug(
        `${callerType} findForMindMapNode -> 
          mmid: ${req.query.mmid}, nid: ${req.query.nid}`
      );
      return Project.findOne({
        where: {
          mindmapId: parseInt(req.query.mmid),
          nodeId: parseInt(req.query.nid)
        },
        order: [["title", "DESC"]]
      })
        .then(proj => {
          logger.info(
            `${callerType} findByMindMapNode -> successful, 
            id: ${proj ? proj.id : "none found"}`
          );
          res.status(200).send(proj);
        })
        .catch(error => {
          logger.error(
            `${callerType} findByMindMapNode -> error: ${error.stack}`
          );
          res.status(400).send(error);
        });
    } else if (req.query.mmid) {
      logger.debug(`${callerType} findForMindMap -> mmid: ${req.query.mmid}`);
      return Project.findAll({
        where: { mindmapId: parseInt(req.query.mmid) },
        order: [["title", "DESC"]]
      })
        .then(projs => {
          logger.info(
            `${callerType} findForMindMap -> successful, count: ${projs.length}`
          );
          res.status(200).send(projs);
        })
        .catch(error => {
          logger.error(`${callerType} findForMindMap -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    } else {
      logger.debug(`${callerType} list -> requested`);
      return Project.findAll({
        include: [
          {
            model: Organization,
            as: "organization"
          }
        ]
      })
        .then(projs => {
          logger.info(
            `${callerType} list -> successful, count: ${projs.length}`
          );
          res.status(200).send(projs);
        })
        .catch(error => {
          logger.error(`${callerType} findById -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    }
  }
};
