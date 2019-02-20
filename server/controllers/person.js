/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/person.js
 * Created:  2019-02-16 11:29:38
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-19 09:43:17
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const Person = require("../models/person");
const Organization = require("../models/organization");
const bCrypt = require("bcrypt");
const emailAddresses = require("email-addresses");
const logger = require("../util/logger")(__filename);
// var express = require('express');
// const bodyParser = require('body-parser');
// const OrgController = require('./organization');
const callerType = "controller";

// construct a hash
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
    bCrypt.hash(req.body.password, 12, function(err, hashedValue) {
      Person.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        orgId: req.body.orgId,
        email: req.body.email,
        pwdhash: hashedValue
      })
        .then(person => {
          console.log("Adding person");
          res.status(201).send(person);
        })
        .catch(error => {
          console.log(error.stack);
          res.status(400).send(error);
        });
    });

    return Person;
  },

  // Update a person
  update(req, res) {
    const id = req.params.id;
    console.log("Body is: " + req.body);
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
      .then(person => res.status(200).send(person))
      .catch(error => res.status(400).send(error));
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
      .then(person => res.status(200).send(person))
      .catch(error => res.status(400).send(error));
  },

  // Find a person by Id
  findByUsername(req, res) {
    return Person.findOne({
      where: {
        username: req.params.username
      }
    })
      .then(person => res.status(200).send(person))
      .catch(error => res.status(400).send(error));
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
      .then(person => res.status(200).send(person))
      .catch(error => {
        console.log(error.stack);
        res.status(400).send(error);
      });
  }
};
