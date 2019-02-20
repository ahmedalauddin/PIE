/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/project.js
 * Created:  2019-02-01 12:39:21
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-20 15:18:49
 * Editor:   Darrin Tisdale
 */
"use strict";

// declaration
const proj = require("../controllers/project");
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // get a list of projects
  logger.debug(`${callerType} GET -> path: /api/projects`);
  router.get("/api/projects", proj.list);

  // Create a project
  logger.debug(`${callerType} POST -> path: /api/projects`);
  router.post("/api/projects", proj.create);

  // Retrieve a single project by Id
  logger.debug(`${callerType} GET -> path: /api/projects/:id`);
  router.get("/api/projects/:id", proj.findById);

  // Update a project with id
  logger.debug(`${callerType} PUT -> path: /api/projects/:id`);
  router.put("/api/projects/:id", proj.update);

  // delete a project with id
  logger.debug(`${callerType} DELETE -> path: /api/projects/:id`);
  router.delete("/api/projects/:id", proj.destroy);

  // find all projects by mindmap
  logger.debug(`${callerType} GET -> path: /api/projects/?mmid=:mmid`);
  router.get("/api/projects/?mmid=:mmid", proj.findForMindMap);

  // find project by mindmap and node id
  logger.debug(`${callerType} GET -> path: /api/projects/?mmid=:mmid&nid=:nid`);
  router.get("/api/projects/?mmid=:mmid&nid=:nid", proj.findForMindMapNode);

  // Update a project with mindmap and node id
  logger.debug(`${callerType} PUT -> 
    path: /api/projects/?mmid=:mmid&nid=:nid`);
  router.put("/api/projects/?mmid=:mmid&nid=:nid", proj.updateByMindMapNode);

  // delete a project with mindmap and node id
  logger.debug(`${callerType} DELETE -> 
    path: /api/projects/?mmid=:mmid&nid=:nid`);
  router.put("/api/projects/?mmid=:mmid&nid=:nid", proj.destroyByMindMapNode);
};
