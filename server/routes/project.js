/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/project.js
 * Created:  2019-02-01 12:39:21
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-18 16:15:50
 * Editor:   Darrin Tisdale
 */
"use strict";

// declaration
import {
  create,
  list,
  findById,
  update,
  destroy,
  findForMindMap,
  findForMindMapNode,
  updateByMindMapNode,
  destroyByMindMapNode
} from "../controllers/project";
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // get a list of projects
  logger.debug(`${callerType} GET -> path: /api/projects`);
  router.get("/api/projects", list);

  // Create a project
  logger.debug(`${callerType} POST -> path: /api/projects`);
  router.post("/api/projects", create);

  // Retrieve a single project by Id
  logger.debug(`${callerType} GET -> path: /api/projects/:id`);
  router.get("/api/projects/:id", findById);

  // Update a project with id
  logger.debug(`${callerType} PUT -> path: /api/projects/:id`);
  router.put("/api/projects/:id", update);

  // delete a project with id
  logger.debug(`${callerType} DELETE -> path: /api/projects/:id`);
  router.delete("/api/projects/:id", destroy);

  // find all projects by mindmap
  logger.debug(`${callerType} GET -> path: /api/projects/?mmid=:mmid`);
  router.get("/api/projects/?mmid=:mmid", findForMindMap);

  // find project by mindmap and node id
  logger.debug(`${callerType} GET -> path: /api/projects/?mmid=:mmid&nid=:nid`);
  router.get("/api/projects/?mmid=:mmid&nid=:nid", findForMindMapNode);

  // Update a project with mindmap and node id
  logger.debug(`${callerType} PUT -> 
    path: /api/projects/?mmid=:mmid&nid=:nid`);
  router.put("/api/projects/?mmid=:mmid&nid=:nid", updateByMindMapNode);

  // delete a project with mindmap and node id
  logger.debug(`${callerType} DELETE -> 
    path: /api/projects/?mmid=:mmid&nid=:nid`);
  router.put("/api/projects/?mmid=:mmid&nid=:nid", destroyByMindMapNode);
};
