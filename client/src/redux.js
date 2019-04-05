/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/redux.js
 * Created:  2019-03-23 14:04:12
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-23 15:08:22
 * Editor:   Darrin Tisdale
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
export const store = createStore(
  combineReducers({
    state: reducers
  }),
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
  return JSON.parse(store.getState().state.user);
}

/**
 * *getOrg*
 * retrieve the full org object from redux
 *
 * @export
 * @returns org object
 */
export function getOrg() {
  return JSON.parse(store.getState().state.organization);
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
    value = JSON.parse(store.getState().state.organization).id;
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
 * @returns string with the orgabnization name
 */
export function getOrgName() {
  let value = "";
  try {
    value = JSON.parse(store.getState().state.organization).name;
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
  return JSON.parse(store.getState().state.user).organization.name;
}
