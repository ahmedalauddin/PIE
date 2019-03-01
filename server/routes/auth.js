/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/auth.js
 * Created:  2019-02-16 11:29:38
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-20 22:33:50
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
//import withAuth from "../../client/src/components/withAuth.jsx";

const auth = require("../controllers/auth");
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerClass = "router";

  // authenticate
  logger.debug(`${callerClass} POST -> path: /api/authenticate`);
  router.post("/api/authenticate", auth.authenticate);


  // logout
  logger.debug(`${callerClass} GET -> path: /api/logout`);
  router.get("/api/logout", auth.logout);

  // validateToken
  logger.debug(`${callerClass} POST -> path: /validateToken`);
  router.get("/validateToken", auth.validateToken);


  // TODO: add logout route.

  // TODO need is logged check first on signup

  /* TODO check if we need this.
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/signin');
    }
    */
};
