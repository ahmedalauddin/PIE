/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/organization.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-20 15:17:14
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const org = require("../controllers/organization");
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // select all organizations
  logger.debug(`${callerType} GET -> path: /api/organizations`);
  router.get("/api/organizations", org.list);

  // get organizations, but use an alternative format
  logger.debug(`${callerType} GET -> path: /api/organizations/?format=select`);
  router.get("/api/organizations/?format=select", org.selectList);

  // select a single organization by ID
  logger.debug(`${callerType} GET -> path: /api/organizations/:id`);
  router.get("/api/organizations/:id", org.findById);

  // select organization by name
  logger.debug(`${callerType} GET -> path: /api/organizations/?name=:name`);
  router.get("/api/organizations/?name=:name", org.findByName);

  // create an organization
  logger.debug(`${callerType} POST -> path: /api/organizations`);
  router.post("/api/organizations", org.create);

  // TODO add PUT /api/organizations/:id method for updating an organization
  // TODO add DELETE /api/organizations/:id method for deleting an organization
};
