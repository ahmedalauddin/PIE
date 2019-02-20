/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/kpi.js
 * Created:  2019-01-27 13:43:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-20 16:26:48
 * Editor:   Darrin Tisdale
 */
"use strict";

// declaractions
const kpi = require("../models/kpi");
const organization = require("../models/organization");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

module.exports = {
  create(req, res) {
    return kpi
      .create({
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        level: req.body.level,
        status: req.body.status,
        orgId: req.body.orgId
      })
      .then(_k => {
        logger.debug(`${callerType} create -> added kpi, id: ${_k.id}`);
        res.status(201).send(_k);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a Kpi
  update(req, res) {
    const id = req.params.id;
    return kpi
      .update(
        {
          title: req.body.title,
          description: req.body.description,
          type: req.body.type,
          level: req.body.level,
          status: req.body.status,
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
    return kpi
      .findByPk(req.params.id, {
        include: [
          {
            model: organization,
            as: "organization"
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

  // List all persons
  list(req, res) {
    return kpi
      .findAll({
        include: [
          {
            model: organization,
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
