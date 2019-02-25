/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/person.js
 * Created:  2019-02-16 11:29:38
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-21 10:00:20
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const models = require("../models");
//const Organization = require("../models").Organization;
const bCrypt = require("bcrypt");
const util = require("util");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

// construct a hash
/** eslint no-unused vars */
function getHash(value) {
  var hashedValue = bCrypt.hashSync(value, 12);
  logger.debug(`${callerType} getHash -> hash: ${hashedValue}`);
  return hashedValue;
}

module.exports = {
  create(req, res) {
    logger.debug(`${callerType} create -> before hash, pass: ${req.body.password}`);
    let hashedValue = getHash(req.body.password);
    logger.debug(`${callerType} create -> after hash, hash: ${hashedValue}`);
    return models.Person.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      orgId: req.body.orgId,
      pwdhash: hashedValue,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.confirm
    })
      .then(p => {
        logger.debug(`${callerType} create -> added person, id: ${p.id}`);
        res.status(201).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a person
  update(req, res) {
    const id = req.params.id;
    logger.debug(
      `${callerType} update -> body: ${util.inspect(req.body, {
        showHidden: false,
        depth: null
      })}`
    );
    return models.Person.update(
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        pwdhash: req.body.pwdhash,
        orgId: req.body.orgId
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    )
      .then(p => {
        logger.debug(`${callerType} update -> successful`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a person by Id
  findById(req, res) {
    return models.Person.findById(req.params.id, {
      include: [
        {
          model: Organization,
          as: "Organization"
        }
      ]
    })
      .then(p => {
        logger.debug(`${callerType} findById -> username: ${p.username}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a person by Id
  findByUsername(req, res) {
    return models.Person.findOne({
      where: {
        username: req.params.username
      }
    })
      .then(p => {
        logger.debug(`${callerType} findByUsername -> id: ${p.id}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findByUsername -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all persons
  list(req, res) {
    logger.debug(`${callerType} list -> start`);
    return models.Person.findAll({
      include: [
        {
          model: models.Organization,
          as: "Organization"
        }
      ],
      order: [["username", "ASC"]]
    })
      .then(people => {
        logger.debug(`${callerType} list -> count: ${people.length}`);
        res.status(200).send(people);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
