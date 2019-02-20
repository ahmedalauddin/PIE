/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/mindmap.js
 * Created:  2019-01-27 17:59:36
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-17 20:52:20
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
import {
  create,
  list,
  findById,
  findByOrgId,
  update,
  deleteMindmap
} from "../controllers/mindmap";
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // get all mindmaps
  logger.debug(`${callerType} GET -> path: /api/mindmaps`);
  router.get("/api/mindmaps", list);

  // create a mindmap
  logger.debug(`${callerType} POST -> path: /api/mindmaps`);
  router.post("/api/mindmaps", create);

  // get a mindmap by id
  logger.debug(`${callerType} GET -> path: /api/mindmaps/:id`);
  router.get("/api/mindmaps/:id", findById);

  // update a mindmap
  logger.debug(`${callerType} PUT -> path: /api/mindmaps/:id`);
  router.put("/api/mindmaps/:id", update);

  // get a mindmap by the orgId
  logger.debug(`${callerType} GET -> path: /api/mindmaps/?orgId=:orgId`);
  router.get("/api/mindmaps/?orgId=:orgId", findByOrgId);

  // delete a mindmap
  logger.debug(`${callerType} DELETE -> path: /api/mindmaps/:id`);
  router.delete("/api/mindmaps/:id", deleteMindmap);
};
