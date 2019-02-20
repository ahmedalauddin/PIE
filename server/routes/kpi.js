/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/kpi.js
 * Created:  2019-01-27 17:59:36
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-18 13:15:58
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const logger = require("../util/logger")(__filename);
import { create, findById, update, list } from "../controllers/kpi";

module.exports = router => {
  const callerClass = "router";

  // get the list of kpis
  logger.debug(`${callerClass} GET -> path: /api/kpis`);
  router.get("/api/kpis", list);

  // create a kpi
  logger.debug(`${callerClass} POST -> path: /api/kpis`);
  router.post("/api/kpis", create);

  // select a kpi by ID
  logger.debug(`${callerClass} GET -> path: /api/kpis/:id`);
  router.get("/api/kpis/:id", findById);

  // Update a person with id
  logger.debug(`${callerClass} PUT -> path: /api/kpis/:id`);
  router.put("/api/kpis/:id", update);

  // TODO create DELETE /api/kpis/:id to delete a kpi
};
