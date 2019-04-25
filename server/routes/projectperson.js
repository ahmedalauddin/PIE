/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/projectperson.js
 * Created:  2019-04-23
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declarations
const projectPersonController = require("../controllers").ProjectPerson;
const logger = require("../util/logger")(__filename);

// module export for routes
module.exports = router => {
  const callerType = "router";

  // get all persons for a project
  logger.debug(`${callerType} GET -> path: /api/projectpersons/:id`);
  router.get("/api/projectpersons/:id", projectPersonController.getProject);

  // Update persons with project id - PUT
  logger.debug(`${callerType} PUT -> path: /api/projectpersons/:id`);
  router.put("/api/projectpersons/:id", projectPersonController.update);
};
