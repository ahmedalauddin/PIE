/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/person.js
 * Created:  2019-02-16 11:29:38
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-04-19
 * Editor:   Brad Kaufman
 */
"use strict";

// declarations
const models = require("../models");
const Organization = require("../models").Organization;
const Project = require("../models").Project;
const Task = require("../models").Task;
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
    let password = req.body.password;
    let confirm = req.body.confirm;
    if (password === undefined) {
      password = "*7Bq9kq^vD373&";
      confirm = "*7Bq9kq^vD373&";
    }
    let hashedValue = getHash(password);
    logger.debug(`${callerType} create -> after hash, hash: ${hashedValue}`);
    return models.Person.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      orgId: req.body.orgId,
      role: req.body.role,
      deptId: req.body.deptId,
      pwdhash: hashedValue,
      email: req.body.email,
      password: password,
      passwordConfirmation: confirm
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

  update(req, res) {
    const id = req.params.id;
    logger.debug("Calling Person update");
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
        role: req.body.role,
        deptId: req.body.deptId,
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
          as: "organization"
        },
        {
          model: Project,
          as: "projects"
        },
        {
          model: Task,
          as: "tasks"
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

  // Find a list of persons by project, including those with the organization bu not assigned
  // to the project.
  findByProject(req, res) {
    let sql = "select O.id, O.name, Pr.id,  P.id as projectId, P.title, PP.inProject, PP.owner, Pr.firstName, Pr.lastName, Pr.email, " +
      "concat('assigned-', Pr.id) as checkname " +
      "from Persons Pr inner join Organizations O " +
      "on O.id = Pr.orgId  " +
      "inner join Projects P on O.id = P.orgId and P.id = " + req.params.projectId + " " +
      "left outer join ProjectPersons PP " +
      "on PP.personId = Pr.id and PP.projectId = P.id " +
      "order by Pr.lastName, Pr.firstName;";
    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(p => {
        logger.debug(`${callerType} findByProject -> sql: ${req.params.projectId}`);
        logger.debug(`${callerType} findByProject -> ProjectId: ${req.params.projectId}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findByProject -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  findByOrganization(req, res) {
    let orgId = req.params.orgId;
    let sql = "select P.id, P.fullName, P.email, P.role, P.orgId, D.name as department, \
      (select group_concat(title) from Projects Pr, ProjectPersons PP \
      where Pr.id = PP.projectId and PP.personId = P.id order by Pr.title) as projects \
      from Persons P left outer join Departments D on P.deptId = D.id \
      where P.orgId = " + orgId + "  \
      order by P.fullName";
    return models.sequelize
      .query(
        sql,
        {
          type: models.sequelize.QueryTypes.SELECT
        }
      )
      .then(p => {
        logger.debug(`${callerType} findByOrganization -> sql: ${orgId}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findByOrganization -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // Find a person by Id
  findByEmail(req, res) {
    return models.Person.findOne(req.params.email, {
      include: [
        {
          model: Organization,
          as: "organization"
        },
        {
          model: Project,
          as: "project"
        }
      ]
    })
      .then(p => {
        logger.debug(`${callerType} findByEmail -> username: ${p.username}`);
        res.status(200).send(p);
      })
      .catch(error => {
        logger.error(`${callerType} findByEmail -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  },

  // List all persons
  list(req, res) {
    if (req.query.email) {
      logger.debug(`${callerType} list -> email: ${req.query.email}`);
      return models.Person.findOne({
        where: {
          email: req.params.email
        }
      })
        .then(p => {
          logger.debug(`${callerType} list -> id: ${p.id}`);
          res.status(200).send(p);
        })
        .catch(error => {
          logger.error(`${callerType} list -> error: ${error.stack}`);
          res.status(400).send(error);
        });
    } else {
      logger.debug(`${callerType} list -> start`);
      return models.Person.findAll({
        include: [
          {
            model: models.Organization,
            as: "organization"
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
  }
};
