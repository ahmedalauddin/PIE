/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/person.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-20 15:17:58
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const person = require("../controllers/person");
const logger = require("../util/logger")(__filename);

// module export for routes
module.exports = router => {
  const callerType = "router";

  // get all persons
  logger.debug(`${callerType} GET -> path: /api/persons`);
  router.get("/api/persons", person.list);

  // create a person
  logger.debug(`${callerType} POST -> path: /api/persons`);
  router.post("/api/persons", person.create);

  // Update a person with id
  logger.debug(`${callerType} PUT -> path: /api/persons/:id`);
  router.put("/api/persons/:id", person.update);

  // TODO add DELETE /api/persons/:id for deleting a person

  // get a person
  logger.debug(`${callerType} GET -> path: /api/persons/:id`);
  router.get("/api/persons/:id", person.findById);

  // get a person by username
  logger.debug(`${callerType} GET -> path: /api/persons/?username=:username`);
  router.get("/api/persons/?username=:username", person.findByUsername);
};
