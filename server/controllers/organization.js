/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/organization.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-18 16:17:11
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const logger = require("../util/logger");
const Organization = require("../models/organization");
const Person = require("../models/person");
const Project = require("../models/project");
const Kpi = require("../models/kpi");
const mvcType = "controller";

// create an organization
export function create(req, res) {
  logger.debug(`${mvcType} create --> name = ${req.params.name}`);
  return Organization.create({
    name: req.body.name,
    owningOrg: req.body.owningOrg
  })
    .then(org => {
      logger.info(`${mvcType} create-> new org, id = ${org.id}`);
      res.status(201).send(org);
    })
    .catch(error => {
      logger.error(error.stack);
      res.status(400).send(error);
    });
}

// select all organizations
export function list(req, res) {
  logger.debug(`${mvcType} list -> called`);
  return Organization.findAll({
    include: [
      {
        model: Person,
        as: "Persons"
      },
      {
        model: Project,
        as: "Projects"
      },
      {
        model: Kpi,
        as: "Kpis"
      }
    ],
    order: [["name", "ASC"]]
  })
    .then(orgs => {
      logger.info(`${mvcType} list -> ${orgs.length} orgs`);
      res.status(200).send(orgs);
    })
    .catch(error => {
      logger.error(error.stack);
      res.status(400).send(error);
    });
}

// formal list for selects
export function selectList(req, res) {
  logger.debug(`${mvcType} selectList -> called`);
  return Organization.findAll({
    attributes: ["id", "name"],
    order: [["name", "ASC"]]
  })
    .then(orgs => {
      logger.info(`${mvcType} selectList -> ${orgs.length} orgs`);
      res.status(200).send(orgs);
    })
    .catch(error => {
      logger.error(error.stack);
      res.status(400).send(error);
    });
}

// Find an org by Id
export function findById(req, res) {
  logger.debug(`${mvcType} findById -> id = ${req.params.id}`);
  return Organization.findById(req.params.id)
    .then(org => {
      logger.info(`${mvcType} findById -> org = ${org.name}`);
      res.status(200).send(org);
    })
    .catch(error => {
      logger.error(error.stack);
      res.status(400).send(error);
    });
}

// find an org by Name
export function findByName(req, res) {
  logger.debug(`${mvcType} findByName -> name = ${req.params.name}`);
  return Organization.findOne({
    where: {
      name: req.params.name
    }
  })
    .then(org => {
      logger.info(`${mvcType} findByName -> id = ${org.id}`);
      res.status(200).send(org);
    })
    .catch(error => {
      logger.error(error.stack);
      res.status(400).send(error);
    });
}
