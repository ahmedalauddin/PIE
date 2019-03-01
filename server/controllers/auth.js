const models = require("../models");
const bCrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const logger = require("../util/logger")(__filename);
const mvcType = "controller";
//const secret = 'quid-pro-quo';

module.exports = {
  authenticate(req, res) {
    logger.debug(`${mvcType} authenticate -> start`);
    // Find a person by username.
    logger.debug(`${mvcType} authenticate -> email: ${req.body.email}`);
    return models.Person.findOne({
      where: {
        email: req.body.email
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
            logger.debug(`${mvcType} authenticate -> returning token ${token}`);
            /*
            res.json({
              success: true,
              err: null,
              token: token
            }); */
            res.cookie('token', token, { httpOnly: true }).sendStatus(200);
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

  logout(req, res) {
    logger.debug(`${mvcType} logout -> start`);
    res.cookie('token', "", { httpOnly: true }).sendStatus(200);
  },

  validateToken(req, res) {
    // check header or url parameters or post parameters for token
    logger.debug(`${mvcType} validateToken -> enter`);
    //var token = req.body.token || req.query.token || req.headers['x-access-token'];

    const token =
      req.body.token ||
      req.params.token ||
      req.headers["x-access-token"] ||
      req.headers["authorization"] ||
      req.cookies.token;

    //const token = req.headers["authorization"];
    logger.debug(`${mvcType} validateToken -> set var token, token = ${token}`);

    // decode token
    if (token) {
      logger.debug(`${mvcType} validateToken -> before jwt.verify`);
      // verifies secret and checks exp
      jwt.verify(token, config.get("security.jwtSecret"), function(err, decoded) {
        if (err) {
          logger.debug(`${mvcType} validateToken -> err, Failed to authenticate token`);
          return res.json({
            success: false,
            message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          logger.debug(`${mvcType} validateToken -> success`);
          req.decoded = decoded;
          // TODO Check if we need next();
          //next();
          return res.status(200);
        }
      });
    } else {
      // if there is no token
      // return an error
      logger.error(`${mvcType} validateToken -> error: no token`);
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  },

  index(req, res) {
    res.json({
      success: true,
      message: "/"
    });
  }
};
