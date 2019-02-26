/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/person.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-21 05:11:51
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const personController = require("../controllers").Person;
const logger = require("../util/logger")(__filename);

// module export for routes
module.exports = router => {
  const callerType = "router";

  // get all persons
  logger.debug(`${callerType} GET -> path: /api/persons`);
  router.get("/api/persons", personController.list);

  // create a person
  logger.debug(`${callerType} POST -> path: /api/persons`);
  router.post("/api/persons", personController.create);

  // Update a person with id
  logger.debug(`${callerType} PUT -> path: /api/persons/:id`);
  router.put("/api/persons/:id", personController.update);

  // TODO add DELETE /api/persons/:id for deleting a person

  // get a person
  logger.debug(`${callerType} GET -> path: /api/persons/:id`);
  router.get("/api/persons/:id", personController.findById);

  // get a person by email
  logger.debug(`${callerType} GET -> path: /api/persons/email/:email`);
  router.get(
    "/api/persons/email/:email",
    personController.findByEmail
  );

  // get a person by username
  logger.debug(`${callerType} GET -> path: /api/persons/?username=:username`);
  router.get(
    "/api/persons/?username=:username",
    personController.findByUsername
  );
};
