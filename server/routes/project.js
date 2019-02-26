/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/project.js
 * Created:  2019-02-01 12:39:21
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-26 17:58:19
 * Editor:   Darrin Tisdale
 */
"use strict";

// declaration
const projController = require("../controllers").Project;
const logger = require("../util/logger")(__filename);

module.exports = router => {
  const callerType = "router";

  // get a list of projects
  logger.debug(`${callerType} GET -> path: /api/projects`);
  router.get("/api/projects", projController.list);

  // Create a project
  logger.debug(`${callerType} POST -> path: /api/projects`);
  router.post("/api/projects", projController.create);

  // Retrieve a single project by Id
  logger.debug(`${callerType} GET -> path: /api/projects/:id`);
  router.get("/api/projects/:id", projController.findById);

  // Update a project with id
  logger.debug(`${callerType} PUT -> path: /api/projects/:id`);
  router.put("/api/projects/:id", projController.update);

  // delete a project with id
  logger.debug(`${callerType} DELETE -> path: /api/projects/:id`);
  router.delete("/api/projects/:id", projController.destroy);
};
