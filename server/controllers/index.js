/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/index.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-04-12
 * Editor:   Brad Kaufman
 */

const Organization = require("./organization");
const Person = require("./person");
const Project = require("./project");
const Auth = require("./auth");
const Department = require("./department");
const Kpi = require("./kpi");
const Mindmap = require("./mindmap");
const Task = require("./task");

module.exports = {
  Organization,
  Person,
  Project,
  Auth,
  Department,
  Kpi,
  Mindmap,
  Task
};
