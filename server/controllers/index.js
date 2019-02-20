/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/index.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-18 01:12:12
 * Editor:   Darrin Tisdale
 */

import organization from "./organization";
import person from "./person";
import project from "./project";
import auth from "./auth";
import kpi from "./kpi";
import mindmap from "./mindmap";

export default {
  organization,
  person,
  project,
  auth,
  kpi,
  mindmap
};
