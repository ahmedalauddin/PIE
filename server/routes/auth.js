/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/auth.js
 * Created:  2019-02-16 11:29:38
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-16
 * Editor:   Brad Kaufman
 */
"use strict";

const auth = require("../controllers/auth");
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerClass = "router";

  // authenticate
  logger.debug(`${callerClass} POST -> path: /api/authenticate`);
  router.post("/api/authenticate", auth.authenticate);

  // set client org for ValueInfinity users
  logger.debug(`${callerClass} POST -> path: /api/setClient`);
  router.post("/api/setClient", auth.setClient);

  // get client org for ValueInfinity users
  logger.debug(`${callerClass} POST -> path: /api/getTokenOrganizationId`);
  router.get("/api/getTokenOrganizationId", auth.getTokenOrganizationId);

  // logout
  logger.debug(`${callerClass} GET -> path: /api/logout`);
  router.get("/api/logout", auth.logout);

  // validateToken
  logger.debug(`${callerClass} POST -> path: /api/validate`);
  router.get("/api/validate", auth.validateToken);

  // TODO need is logged check first on signup

  /* TODO check if we need this.
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/signin');
    }
    */
};
