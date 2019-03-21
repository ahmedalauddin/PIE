import {combineReducers, createStore} from "redux";

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

export const reds = (state = defaultState, action) => {
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


export const reducers = combineReducers({
  reds,
});

// store.js
export function configureStore(initialState = {}) {
  const store = createStore(reducers, initialState);
  return store;
};

export function getUser() {
  return(store.getState().reds.user);
};

export function getOrg() {
  return(store.getState().reds.organization);
};


export const store = configureStore();
