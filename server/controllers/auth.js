/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/auth.js
 * Created:  2019-03-01 04:37:25
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-17
 * Editor:   Brad Kaufman
 */
const Person = require("../models").Person;
const bCrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const logger = require("../util/logger")(__filename);
const Organization = require("../models").Organization;
const Project = require("../models").Project;
const Task = require("../models").Task;
const mvcType = "controller";
const cookieName = "token";

function writeJwt(email, organization) {
  let token = jwt.sign(
    { email: email, organization: organization},
    config.get("security.jwtSecret"),
    {
      expiresIn: "24h" // expires in 24 hours
    }
  );
  return token;
};

module.exports = {
  authenticate(req, res) {
    logger.debug(`${mvcType} authenticate -> start`);
    // Find a person by email.
    logger.debug(`${mvcType} authenticate -> email: ${req.body.email}`);
    return Person.findOne({
      where: {
        email: req.body.email
      },
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
        logger.debug(
          `${mvcType} authenticate -> 
            Success, found person, pwdhash: ${p.pwdhash}`
        );

        bCrypt.compare(req.body.password, p.pwdhash, function(err, result) {
          if (result === true) {
            // Logged in successfully.
            logger.debug(`${mvcType} authenticate -> successful`);
            let token = writeJwt(p.email, p.organization);

            // return the JWT token for the future API calls
            logger.debug(
              `${mvcType} authenticate -> returning token ${token} as cookie`
            );
            res.cookie(cookieName, token, { httpOnly: true }).status(200).json(p);
          } else {
            // Login failed
            let _m = "Username or password is incorrect";
            logger.debug(`${mvcType} authenticate -> ${_m}`);
            res.status(401).json({
              auth: false,
              success: false,
              token: null,
              err: _m
            });
          }
        });
      })
      .catch(error => {
        logger.error(`${mvcType} authenticate -> error: ${error.stack}`);
        res.status(400).send({
          auth: false,
          success: false,
          token: null,
          message: "Unknown error occurred"
        });
      });
  },

  /*
  // For ValueInfinity users, set the client being used in the JWT token.  At this
  // point the user should already be logged in.
  setClient(req, res) {
    logger.debug(`${mvcType} setClient -> start`);
    // Get the organization submitted.
    let clientId = req.body.orgId;
    logger.debug(`${mvcType} setClient -> client ID: ${req.body.orgId}`);

    // First, get information from the token.
    logger.debug(`${mvcType} validateToken -> enter`);

    const token =
      req.cookies.token ||
      req.body.token ||
      req.params.token ||
      req.headers["X-Access-Token"] ||
      req.headers["Authorization"];

    //const token = req.headers["authorization"];
    logger.debug(`${mvcType} setClient -> token = ${token}`);

    var _code = 403;
    var _body = {};

    // decode token
    if (token) {
      logger.debug(`${mvcType} setClient -> before jwt.verify`);
      // verifies secret and checks exp
      jwt.verify(token, config.get("security.jwtSecret"), function(
        err,
        decoded
      ) {
        if (err) {
          logger.error(
            `${mvcType} setClient -> error, failed to authenticate token`
          );
          _code = 200;
          _body = {
            success: false,
            message: "Failed to authenticate token"
          };
        } else {
          logger.debug(`${mvcType} setClient -> Using jwt, decoded token is, email: ${decoded.email}, org: ${decoded.organization}`);

          logger.debug(`${mvcType} setClient -> client ID: ${clientId}`);
          // Write the token again, this time with the client ID.
          let token2 = writeJwt(decoded.email, decoded.organization, clientId);

          _code = 200;
          res.cookie(cookieName, token2, { httpOnly: true }).sendStatus(200);
        }
      });
    } else {
      // if there is no token
      // return an error
      logger.error(`${mvcType} validateToken -> error: no token`);
      _body = {
        success: false,
        message: "No token provided."
      };
    }
  },
  */

  logout(req, res) {
    logger.debug(`${mvcType} logout -> clearing cookie ${cookieName}`);
    res.clearCookie(cookieName, { httpOnly: true }).sendStatus(200);
  },

  // Get the organization ID for the user from the JSON Web Token.
  getTokenOrganizationId(req) {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.params.token ||
      req.headers["X-Access-Token"] ||
      req.headers["Authorization"];

    var clientId = 0;

    // decode token
    if (token) {
      logger.debug(`${mvcType} getTokenOrganizationId -> before jwt.verify`);
      // verifies secret and checks exp
      jwt.verify(token, config.get("security.jwtSecret"), function(
        err,
        decoded
      ) {
        if (!err) {
          logger.debug(`${mvcType} getTokenOrganizationId -> organization ID is: ${decoded.clientId}`);
          clientId = decoded.clientId;
        }
      });
    }

    // send the result
    // check header or url parameters or post parameters for token
    logger.debug(`${mvcType} getTokenOrganizationId -> clientId: ${clientId}`);
    return clientId;
  },


  validateToken(req, res) {
    // check header or url parameters or post parameters for token
    logger.debug(`${mvcType} validateToken -> enter`);

    const token =
      req.cookies.token ||
      req.body.token ||
      req.params.token ||
      req.headers["X-Access-Token"] ||
      req.headers["Authorization"];

    //const token = req.headers["authorization"];
    logger.debug(`${mvcType} validateToken -> token = ${token}`);

    var _code = 403;
    var _body = {};

    // decode token
    if (token) {
      logger.debug(`${mvcType} validateToken -> before jwt.verify`);
      // verifies secret and checks exp
      jwt.verify(token, config.get("security.jwtSecret"), function(
        err,
        decoded
      ) {
        if (err) {
          logger.error(
            `${mvcType} validateToken -> error, failed to authenticate token`
          );
          _code = 200;
          _body = {
            success: false,
            message: "Failed to authenticate token"
          };
        } else {
          // if everything is good, save to request for use in other routes
          logger.debug(`${mvcType} validateToken -> success`);
          res.decoded = decoded;
          logger.debug(`${mvcType} validateToken -> decoded token is: ${decoded}`);
          _code = 200;
        }
      });
    } else {
      // if there is no token
      // return an error
      logger.error(`${mvcType} validateToken -> error: no token`);
      _body = {
        success: false,
        message: "No token provided."
      };
    }

    // send the result
    return res.status(_code).json(_body);
  },

  index(req, res) {
    res.json({
      success: true,
      message: "/"
    });
  }
};
