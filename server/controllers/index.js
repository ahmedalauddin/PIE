/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/index.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-23
 * Editor:   Brad Kaufman
 */

const Organization = require("./organization");
const Person = require("./person");
const Project = require("./project");
const Auth = require("./auth");
const Kpi = require("./kpi");
const Mindmap = require("./mindmap");
const Task = require("./task");

module.exports = {
  Organization,
  Person,
  Project,
  Auth,
  Kpi,
  Mindmap,
  Task
};
