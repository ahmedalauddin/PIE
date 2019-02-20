/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/mindmap.js
 * Created:  2019-01-27 17:59:36
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-20 15:13:01
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const mindmap = require("../controllers/mindmap");
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // get all mindmaps
  logger.debug(`${callerType} GET -> path: /api/mindmaps`);
  router.get("/api/mindmaps", mindmap.list);

  // create a mindmap
  logger.debug(`${callerType} POST -> path: /api/mindmaps`);
  router.post("/api/mindmaps", mindmap.create);

  // get a mindmap by id
  logger.debug(`${callerType} GET -> path: /api/mindmaps/:id`);
  router.get("/api/mindmaps/:id", mindmap.findById);

  // update a mindmap
  logger.debug(`${callerType} PUT -> path: /api/mindmaps/:id`);
  router.put("/api/mindmaps/:id", mindmap.update);

  // get a mindmap by the orgId
  logger.debug(`${callerType} GET -> path: /api/mindmaps/?orgId=:orgId`);
  router.get("/api/mindmaps/?orgId=:orgId", mindmap.findByOrgId);

  // delete a mindmap
  logger.debug(`${callerType} DELETE -> path: /api/mindmaps/:id`);
  router.delete("/api/mindmaps/:id", mindmap.deleteMindmap);
};
