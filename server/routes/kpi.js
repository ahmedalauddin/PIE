/**
 * Project:  valueinfinity-mvp
 * File:     /server/routes/kpi.js
 * Created:  2019-01-27 17:59:36
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-20 15:12:23
 * Editor:   Darrin Tisdale
 */
"use strict";

// declarations
const logger = require("../util/logger")(__filename);
const kpi = require("../controllers/kpi");

module.exports = router => {
  const callerClass = "router";

  // get the list of kpis
  logger.debug(`${callerClass} GET -> path: /api/kpis`);
  router.get("/api/kpis", kpi.list);

  // create a kpi
  logger.debug(`${callerClass} POST -> path: /api/kpis`);
  router.post("/api/kpis", kpi.create);

  // Assign KPIs to a project
  logger.debug(`${callerClass} POST -> path: /api/kpis-assign/:projid`);
  router.post("/api/kpis-assign/:projid", kpi.assignToProject);

  // select a kpi by ID
  logger.debug(`${callerClass} GET -> path: /api/kpis/:id`);
  router.get("/api/kpis/:id", kpi.findById);

  // get KPIs by project
  logger.debug(`${callerClass} GET -> path: /api/kpis-project/:projid`);
  router.get("/api/kpis-project/:projid", kpi.listByProject);

  // search KPIs
  logger.debug(`${callerClass} GET -> path: /api/kpis-search`);
  router.get("/api/kpis-search", kpi.search);

  // Update a KPI with id
  logger.debug(`${callerClass} PUT -> path: /api/kpis/:id`);
  router.put("/api/kpis/:id", kpi.update);

  // Deactivate a KPI with id
  logger.debug(`${callerClass} PUT -> path: /api/kpis-deactivate/:id`);
  router.put("/api/kpis-deactivate/:id", kpi.deactivate);
};
