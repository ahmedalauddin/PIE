/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/mindmap.js
 * Created:  2019-01-27 17:59:36
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-20 16:26:19
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const Mindmap = require("../models/Mindmap");
const logger = require("../util/logger")(__filename);
const callerType = "controller";
//TODO determine means to handle nodes of mindmap creating/updating/deleting projects

module.exports = {
  create(req, res) {
    return Mindmap.create({
      orgId: req.body.orgId,
      mapData: req.body.mapData
    })
      .then(m => {
        logger.debug(`${callerType} create -> id: ${m.id}`);
        res.status(201).send(m);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a mindmap
  update(req, res) {
    const id = req.params.id;
    return Mindmap.update(
      {
        mapData: req.body.mapData
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(m => {
        logger.debug(`${callerType} update -> updatedAt: ${m.updatedAt}`);
        res.status(200).send(m);
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Delete a mindmap
  deleteMindmap(req, res) {
    const id = req.params.id;
    return Mindmap.destroy({
      where: {
        id: id
      }
    })
      .success(c => {
        logger.debug(`${callerType} delete -> ${c} maps deleted`);
        res.status(200).send(c);
      })
      .catch(error => {
        logger.error(`${callerType} delete -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a mindmap by id
  findById(req, res) {
    return Mindmap.findById(req.params.id)
      .success(mms => {
        logger.debug(`${callerType} findById -> count: ${mms.length}`);
        res.status(200).send(mms);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find by organization
  findByOrgId(req, res) {
    const orgId = req.params.orgId;
    return Mindmap.findOne({
      where: {
        orgId: orgId
      }
    })
      .success(map => {
        logger.debug(`${callerType} findByOrgId -> id: ${map.id}`);
        res.status(200).send(map);
      })
      .catch(error => {
        logger.error(`${callerType} findByOrgId -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // FInd all mindmaps
  list(req, res) {
    return Mindmap.findAll({
      include: [
        {
          model: Mindmap,
          as: "Mindmap"
        }
      ]
    })
      .success(maps => {
        logger.debug(`${callerType} findById -> count: ${maps.length}`);
        res.status(200).send(maps);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
