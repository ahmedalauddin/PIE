/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/project.js
 * Created:  2019-02-01 12:39:20
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-21 09:49:55
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const Organization = require("../models").Organization;
const Project = require("../models").Project;
const logger = require("../util/logger")(__filename);
const util = require("util");
const callerType = "controller";

module.exports = {
  // creates a project
  create(req, res) {
    let _obj = util.inspect(req, { showHidden: false, depth: null });
    logger.debug(`${callerType} create -> request: ${_obj}`);
    return Project.create({
      title: req.body.title,
      description: req.body.description,
      orgId: parseInt(req.body.orgId),
      businessGoal: req.body.businessGoal,
      mindmapId: req.body.mindmapId,
      nodeId: req.body.nodeId,
      progress: parseInt(req.body.progress),
      startAt: req.params.startDate,
      endAt: req.params.endDate
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
    let _obj = util.inspect(req, { showHidden: false, depth: null });
    logger.debug(`${callerType} update -> request: ${_obj}`);
    let _id = parseInt(req.body.id);
    return Project.update(
      {
        title: req.body.title,
        description: req.body.description,
        businessGoal: req.body.businessGoal,
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
  },

  // find a project by id
  findById(req, res) {
    let _obj = util.inspect(req.body, { showHidden: false, depth: null });
    logger.debug(`${callerType} findById -> request: ${_obj}`);
    return Project.findById(req.params.id, {
      include: [
        {
          model: Organization,
          as: "organization"
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
  },

  // find all projects
  list(req, res) {
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
        logger.info(`${callerType} list -> successful, count: ${projs.length}`);
        res.status(200).send(projs);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // find projects linked to a mindmap
  findForMindMap(req, res) {
    logger.debug(`${callerType} findForMindMap -> mmid: ${req.body.mmid}`);
    return Project.findAll({
      where: { mindmapId: parseInt(req.body.mmid) },
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
  },

  // find a project by mindmap and node id
  findForMindMapNode(req, res) {
    logger.debug(
      `${callerType} findForMindMapNode -> 
          mmid: ${req.body.mmid}, nid: ${req.body.nid}`
    );
    return Project.findOne({
      where: {
        mindmapId: parseInt(req.body.mmid),
        nodeId: parseInt(req.body.nid)
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
  },

  // Update a project by mindmap and node id
  updateByMindMapNode(req, res) {
    let _obj = util.inspect(req, { showHidden: false, depth: null });
    logger.debug(`${callerType} updateByMindMapNode -> request: ${_obj}`);
    return Project.update(
      {
        title: req.body.title,
        description: req.body.description,
        businessGoal: req.body.businessGoal,
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
  },

  // destroy a project by mindmap and node id
  destroyByMindMapNode(req, res) {
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
  }
};
