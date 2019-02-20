/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/index.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-20 15:27:03
 * Editor:   Darrin Tisdale
 */

const organization = require("./organization");
const person = require("./person");
const project = require("./project");
const auth = require("./auth");
const kpi = require("./kpi");
const mindmap = require("./mindmap");

module.exports = {
  organization,
  person,
  project,
  auth,
  kpi,
  mindmap
};
