import React, { Component } from "react";
import { combineReducers, createStore } from "redux";

// actions.js
export const setUserAction = (userData) => ({
    type: "USER",
    payload: userData
});

export const setOrgAction = (orgData) => ({
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
      }
    case "ORGANIZATION":
      return {
        ...state,
        organization: action.payload
      }
    default:
      return state;
  }
};

/*
function updateUser(state, action) {
  state.user = action.payload;
  return state;
}

function updateOrg(state, action) {
  state.organization = action.payload;
  return state;
}
*/

// store.js
// store is going to represent our global state.
export const store = createStore(
  combineReducers({
    state: reducers,
  })
);

/*
export function configureStore(initialState = {}) {
  const store = createStore(reducers, initialState);
  return store;
};
*/

// selectors
export function getUser() {
  return(store.getState().reducers.user);
};

export function getOrg() {
  return(store.getState().reducers.organization);
};



/*
export const reds = (state = {}, action) => {
  switch (action.type) {
    case "USER":
      return {
        ...state,
        user: action.payload
      }
    case "ORGANIZATION":
      return {
        ...state,
        organization: action.payload
      }
    default:
      return state;
  }
};
*/
