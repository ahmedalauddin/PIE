/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/auth.js
 * Created:  2019-02-16 11:29:38
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-18 13:21:42
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
import { authenticate } from "../controllers/auth";
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerClass = "router";

  // authenticate
  logger.debug(`${callerClass} POST -> path: /api/authenticate`);
  router.post("/api/authenticate", authenticate);

  //app.get('/api/checktoken', middleware.checkToken);

  //app.post('/api/signin', authController.signin);

  //app.post('/api/signup', authController.signup);

  //app.get('/dashboard',isLoggedIn, authController.dashboard);

  //app.get('/api/logout', authController.logout);

  //app.post('/api/signin', authController.signin);

  // TODO need is logged check first on signup
  /*
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/signin');
    }
    */
};
