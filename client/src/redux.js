import React, { Component } from "react";
import { combineReducers, createStore } from "redux";

// actions.js
export const setUserAction = userData => ({
  type: "USER",
  payload: userData
});

export const setOrgAction = orgData => ({
  type: "ORGANIZATION",
  payload: orgData
});

// reducers.js
let defaultState = {
  user: "user1",
  organization: ""
};

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

// store.js
// store is going to represent our global state.
export const store = createStore(
  combineReducers({
    state: reducers
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// selectors
export function getUser() {
  return store.getState().state.user;
}

export function getOrg() {
  return store.getState().state.organization;
}

export function getOrgId() {
  return JSON.parse(store.getState().state.organization).id;
}

