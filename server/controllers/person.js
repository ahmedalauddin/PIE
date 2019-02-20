/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/person.js
 * Created:  2019-02-16 11:29:38
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-20 16:19:39
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const Person = require("../models/person");
const Organization = require("../models/organization");
const bCrypt = require("bcrypt");
//const emailAddresses = require("email-addresses");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

// construct a hash
/** eslint no-unused vars */
function getHash(value) {
  return bCrypt.hash(value, 12, (err, hashedValue) => {
    if (err) {
      logger.error(`${callerType} getHash -> error: ${err.stack}`);
    } else {
      logger.debug(`${callerType} getHash -> hash: ${hashedValue}`);
    }
  });
}

module.exports = {
  create(req, res) {
    let hashedValue = getHash(req.body.password);
    return Person.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      orgId: req.body.orgId,
      email: req.body.email,
      pwdhash: hashedValue
    })
      .then(person => {
        logger.debug(`${callerType} create -> added person, id: ${person.id}`);
        res.status(201).send(person);
      })
      .catch(error => {
        logger.error(`${callerType} create -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Update a person
  update(req, res) {
    const id = req.params.id;
    logger.debug(`${callerType} update -> body: ${req.body}`);
    return Person.update(
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
      .then(person => {
        logger.debug(`${callerType} update -> successful`);
        res.status(200).send(person);
      })
      .catch(error => {
        logger.error(`${callerType} update -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a person by Id
  findById(req, res) {
    return Person.findById(req.params.id, {
      include: [
        {
          model: Organization,
          as: "Organization"
        }
      ]
    })
      .then(person => {
        logger.debug(`${callerType} findById -> username: ${person.username}`);
        res.status(200).send(person);
      })
      .catch(error => {
        logger.error(`${callerType} findById -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a person by Id
  findByUsername(req, res) {
    return Person.findOne({
      where: {
        username: req.params.username
      }
    })
      .then(person => {
        logger.debug(`${callerType} findByUsername -> id: ${person.id}`);
        res.status(200).send(person);
      })
      .catch(error => {
        logger.error(`${callerType} findByUsername -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all persons
  list(req, res) {
    return Person.findAll({
      include: [
        {
          model: Organization,
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
