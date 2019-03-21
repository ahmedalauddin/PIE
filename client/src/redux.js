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
  user: "Brad",
  organization: ""
};


export const reds = (state = {}, action) => {
  switch (action.type) {
    case "USER":
      return updateUser(state, action);
    case "ORGANIZATION":
      return updateOrg(state, action);
    default:
      return state;
  }
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

function updateUser(state, action) {
  state.user = action.payload;
  return state;
}

function updateOrg(state, action) {
  state.organization = action.payload;
  return state;
}


export const reducers = combineReducers({
  reds,
});

// store.js
export function configureStore(initialState = {}) {
  const store = createStore(reducers, initialState);
  return store;
};

export function getUser() {
  console.log("Redux.js, getUser:" + store.getState().reds.user);
  return(store.getState().reds.user);
};

export function getOrg() {
  return(store.getState().reds.organization);
};


export const store = configureStore();
