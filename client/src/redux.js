/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/redux.js
 * Created:  2019-03-23 14:04:12
 * Author:   Brad Kaufman
 * Desc:     Redux store and functions.  Maintaining Redux stores for organization, user, and project search filters.
 *           Going to add mind map.
 *
 * Modified: 2019-10-02
 * Editor:   Brad Kaufman
 */

import { createStore } from "redux";

/**
 * *setUser*
 * redux action to set the user
 *
 * @param {*} userData
 */
export const setUser = userData => ({
  type: "USER",
  payload: userData
});

/**
 * *setOrg*
 * redux action to set the organization
 *
 * @param {*} orgData
 */
export const setOrg = orgData => ({
  type: "ORGANIZATION",
  payload: orgData
});

/**
 * *setMindmap*
 * Redux action to set the mind map.  Need the mindmap id here or somewhere.
 *
 * @param {*} mindmapNodeData
 */
export const setMindmap = mindmapNodeData => ({
  type: "MINDMAP",
  payload: mindmapNodeData
});

/**
 * *setMindmapNode*
 * Redux action to set the selected mind map node.  Pass in the node's json here, e.g. {"id": "_jb42g162q", "name": "new", "note": "", "side": "left"}.
 *
 * @param {*} mindmapNodeData
 */
export const setMindmapNode = mindmapNodeData => ({
  type: "MINDMAP_NODE",
  payload: mindmapNodeData
});

//<editor-fold desc="Set project list filter functions">
/**
 * *setProjectListFilter*
 * redux action to set the project filters, including filters for status, and begin and end years.
 *
 * @param {*} setProjectListFilter
 */
export const setProjectListFilter = projectListFilterData => ({
  type: "PROJECT_LIST_FILTER",
  payload: projectListFilterData
});


export const setProjectStartYearFilter = projectStartYearFilterData => ({
  type: "PROJECT_START_YEAR_FILTER",
  payload: projectStartYearFilterData
});

export const setProjectEndYearFilter = projectEndYearFilterData => ({
  type: "PROJECT_END_YEAR_FILTER",
  payload: projectEndYearFilterData
});

export const setProjectStatusFilter = projectStatusFilter => ({
  type: "PROJECT_STATUS_FILTER",
  payload: projectStatusFilter
});
//</editor-fold>

/**
 * *setProject*
 * redux action to set the project
 *
 * @param {*} projectData
 */
export const setProject = projectData => ({
  type: "PROJECT",
  payload: projectData
});

// local default date, used during initialization
let defaultState = {
  user: "",
  organization: "",
  mindmap: JSON.stringify("{}"),
  mindmapNode: JSON.stringify("{}"),
  project: ""
};

/**
 * *reducers*
 * function handler for redux
 *
 * @param {*} [state=defaultState]
 * @param {*} action
 * @returns
 */
export const reducers = (state = defaultState, action) => {
  switch (action.type) {
    case "USER":
    return {
      ...state,
      user: action.payload
    };
    case "ORGANIZATION":
      return {
        ...state,
        organization: action.payload
      };
    case "MINDMAP_NODE":
      return {
        ...state,
        mindmapNode: action.payload
      };
    case "MINDMAP":
      return {
        ...state,
        mindmap: action.payload
      };
    case "PROJECT_LIST_FILTER":
      return {
        ...state,
        projectListFilter: action.payload
      };
    case "PROJECT_STATUS_FILTER":
      return {
        ...state,
        projectStatusFilter: action.payload
      };
    case "PROJECT_START_YEAR_FILTER":
      return {
        ...state,
        projectStartYearFilter: action.payload
      };
    case "PROJECT_END_YEAR_FILTER":
      return {
        ...state,
        projectEndYearFilter: action.payload
      };
    case "PROJECT":
      return {
        ...state,
        project: action.payload
      };
    default:
    return state;
  }
};

/**
 * *store*
 * creates the redux store
 *
 * @export
 */
// Set conditional load for redux devtools extension
  /*
export const store = createStore(
  combineReducers({
    state: reducers
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);  */
export const store = createStore(reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

/**
 * *getUser*
 * retrieve the full user object from redux
 *
 * @export
 * @returns user object
 */
export function getUser() {
  return JSON.parse(store.getState().user);
}

/**
 * *getMindmap*
 * retrieve the full user object from redux
 *
 * @export
 * @returns mindmap object
 */
export function getMindmap() {
  return JSON.parse(store.getState().mindmap);
}

/**
 * *getMindmapNode*
 * retrieve the full selected mind map node object from redux
 *
 * @export
 * @returns mindmapNode object
 */
export function getMindmapNode() {
  return JSON.parse(store.getState().mindmapNode);
}

/**
 * *getOrg*
 * retrieve the full org object from redux
 *
 * @export
 * @returns organization object
 */
export function getOrg() {
  return JSON.parse(store.getState().organization);
}

//<editor-fold desc="Organization get methods for individual elements from its JSON">
/**
 * *getOrgId*
 * retrieve the id of the organization object
 *
 * @export
 * @returns number for organization ID
 */
export function getOrgId() {
  let value = "";
  try {
    value = JSON.parse(store.getState().organization).id;
  } catch (error) {
    console.log("error: " + error);
  }
  return value;
}

/**
 * *getOrgName*
 * retrieve the name of the organization from redux
 *
 * @export
 * @returns string with the organization name
 */
export function getOrgName() {
  let value = "";
  try {
    value = JSON.parse(store.getState().organization).name;
  } catch (error) {
    console.log("error: " + error);
  }
  return value;
}

/**
 * *getUserOrgName*
 * Retrieve the name of the user's organization from redux
 *
 * @export
 * @returns string with the organization name
 */
export function getUserOrgName() {
  return JSON.parse(store.getState().user).organization.name;
}

/**
 * *getOrgDepartments*
 * Retrieve the name of the user's organization from redux
 *
 * @export
 * @returns JSON with the list of departments for the organization/client
 * specified when the user sets the client filter.
 */
export function getOrgDepartments() {
  return JSON.parse(store.getState().organization).departments;
}
//</editor-fold>

/**
 * *getProjectFilter*
 * Retrieve the active project filter from redux.  This is intended to be used for filtering project lists.
 *
 * @export
 * @returns JSON with the information from the active project filter.
 */
export function getProjectFilter() {
  return JSON.parse(store.getState().projectFilter);
}

/**
 * *getProject*
 * Retrieve the active project from redux
 *
 * @export
 * @returns JSON with the information from the active project being used.
 */
export function getProject() {
  return JSON.parse(store.getState().project);
}

/**
 * *getProjectName*
 * Retrieve the active project name from redux
 *
 * @export
 * @returns JSON with the information from the active project being used.
 */
export function getProjectName() {
  return JSON.parse(store.getState().project).title;
}

/**
 * *isAdministrator*
 * Is the logged in user an administrator
 *
 * @export
 * @returns boolean if the user is an administrator.
 */
export function isAdministrator() {
  let isAdmin = false;
  try {
    isAdmin = JSON.parse(store.getState().user).organization.owningOrg;
    console.log("isAdministrator: user: " + JSON.parse(store.getState().user).email + ", is admin: " + isAdmin.toString());
  } catch (error) {
    console.log("isAdministrator: error");
  }
  return isAdmin;
}

/**
 * *isLoggedIn*
 * Is the logged in user an administrator
 *
 * @export
 * @returns boolean if the user is an administrator.
 */
export function isLoggedIn() {
  // eslint-disable-next-line no-unused-vars
  let user = "";
  let loggedIn = false;
  try {
    user = JSON.parse(store.getState().user);
    if (user != null && user != "") {
      loggedIn = true;
    }
  } catch (error) {
    console.log("user not logged in");
  }
  return loggedIn;
}
