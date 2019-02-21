const models = require("../models");
const bCrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const logger = require("../util/logger")(__filename);
const mvcType = "controller";

module.exports = {
  authenticate(req, res) {
    logger.debug(`${mvcType} authenticate -> start`);
    // Find a person by username.
    logger.debug(`${mvcType} authenticate -> username: ${req.body.username}`);
    return models.Person.findOne({
      where: {
        username: req.body.username
      }
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
            let token = jwt.sign(
              { username: p.username },
              config.get("security.jwtSecret"),
              {
                expiresIn: "24h" // expires in 24 hours
              }
            );
            // return the JWT token for the future API calls
            res.json({
              success: true,
              err: null,
              token
            });
          } else {
            // Login failed.
            let _m = "Username or password is incorrect";
            logger.debug(`${mvcType} authenticate -> ${_m}`);
            res.status(401).json({
              success: false,
              token: null,
              err: _m
            });
          }
        });
      })
      .catch(error => {
        logger.error(`${mvcType} authenticate -> error: ${error.stack}`);
        res
          .status(400)
          .send({ auth: false, message: "Unknown error occurred" });
      });
  },

  index(req, res) {
    res.json({
      success: true,
      message: "/"
    });
  }
};
