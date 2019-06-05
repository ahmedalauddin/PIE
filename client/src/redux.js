/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/redux.js
 * Created:  2019-03-23 14:04:12
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-05
 * Editor:   Brad Kaufman
 */

import { combineReducers, createStore } from "redux";

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
 * *setProjectFilter*
 * redux action to set the project filters
 *
 * @param {*} setProjectFilter
 */
/*
export const setProjectFilter = projectFilterData => ({
  type: "PROJECTFILTER",
  payload: projectFilterData
});

 */
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

/**
 * *setProject*
 * redux action to set the organization
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
  organization: ""
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
// TODO set conditional load for redux devtools extension
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
 * *getOrg*
 * retrieve the full org object from redux
 *
 * @export
 * @returns org object
 */
export function getOrg() {
  return JSON.parse(store.getState().organization);
}

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
  let user = "";
  let loggedIn = false;
  try {
    user = JSON.parse(store.getState().user);
    loggedIn = true;
  } catch (error) {
    console.log("user not logged in");
  }
  return loggedIn;
}
