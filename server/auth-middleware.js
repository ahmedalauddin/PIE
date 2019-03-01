/**
 * Project:  valueinfinity-mvp
 * File:     /server/auth-middleware.js
 * Created:  2019-02-28
 * Author:   Brad Kaufman
 * Description: Middleware for authentication in Express using JSON Web Tokens.  See
 *              https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0.
 * -----
 * Modified:
 * Editor:   Brad Kaufman
 */
"use strict";

/*
const jwt = require('jsonwebtoken');
const config = require("../config/config");
const logger = require("../util/logger")(__filename);
const mvcType = "controller";

// TODO - need to read the secret from env settings.
const secret = config.get("security.jwtSecret");
const withAuth = function(req, res, next) {
  logger.debug(`${mvcType} auth-middleware.withAuth -> before set const token`);
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;
  logger.debug(`${mvcType} auth-middleware.withAuth -> set const token`);
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}
module.exports = withAuth;
*/