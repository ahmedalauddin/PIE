/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/organization.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-26 17:45:43
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const orgController = require("../controllers").Organization;
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // select all organizations
  logger.debug(`${callerType} GET -> path: /api/organizations`);
  router.get("/api/organizations", orgController.list);

  // select all organizations for a dashboard list
  logger.debug(`${callerType} GET -> path: /api/organizations-dashboard`);
  router.get("/api/organizations-dashboard", orgController.dashboardList);

  // select a single organization by ID
  logger.debug(`${callerType} GET -> path: /api/organizations/:id`);
  router.get("/api/organizations/:id", orgController.findById);

  // create an organization
  logger.debug(`${callerType} POST -> path: /api/organizations`);
  router.post("/api/organizations", orgController.create);

  // TODO add PUT /api/organizations/:id method for updating an organization
  // TODO add DELETE /api/organizations/:id method for deleting an organization
};
