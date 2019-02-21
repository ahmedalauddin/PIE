/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/index.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-21 03:35:13
 * Editor:   Darrin Tisdale
 */

const Organization = require("./organization");
const Person = require("./person");
const Project = require("./project");
const Auth = require("./auth");
const Kpi = require("./kpi");
const Mindmap = require("./mindmap");

module.exports = {
  Organization,
  Person,
  Project,
  Auth,
  Kpi,
  Mindmap
};
