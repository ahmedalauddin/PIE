/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/components/AuthHelper.js
 * Created:  2019-02-16 11:29:38
 * Author:   Darrin Tisdale
 * @module:  components/AuthHelper
 * -----
 * Modified: 2019-03-05 15:37:04
 * Editor:   Darrin Tisdale
 */
import decode from "jwt-decode";
import axios from "axios";
import Log from "../util/Log";

// export module name
export const name = "AuthHelper";
const _tokenName = "id_token";

/**
 * class for handling authentication
 * @export
 * @class AuthHelper
 */
export default class AuthHelper {
  /**
   * Creates an instance of AuthHelper.
   * @param {*} domain
   * @memberof AuthHelper
   */
  constructor(domain) {
    //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
    this.domain = domain || "http://localhost:3000"; // API server domain
    Log.trace(`domain set to ${this.domain}`);
  }

  /**
   * performs a query to backend service to verify login information
   * @param username user email
   * @param password password
   * @memberof AuthHelper
   */
  login = (email, password) => {
    // call to the server to determine if we can authenticate
    axios
      .post("/api/authenticate", {
        email: email,
        password: password
      })
      .then(res => {
        // save token to local storage
        this.setToken(res.token);
        Log.trace(`token set to ${res.token}`);

        // return the result
        return Promise.resolve(res);
      })
      .catch(error => {
        Log.error(`authentication failed, error: ${JSON.stringify(error)}`);
      });
  };

  /**
   * check if a user is logged in
   * @memberof AuthHelper
   */
  loggedIn = () => {
    let token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  };

  /**
   * Validates if a JWT has expired
   * @param token javascript web token string to validate
   * @memberof AuthHelper
   */
  isTokenExpired = token => {
    try {
      let decoded = decode(token);
      Log.trace(`token decoded, token: ${JSON.stringify(decoded)}`);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      Log.error(`token decoding failed, error: ${JSON.stringify(error)}`);
      return false;
    }
  };

  /**
   * saves the JWT to local storage
   * @param token string containing the token
   * @memberof AuthHelper
   */
  setToken = token => {
    // Saves user token to localStorage
    localStorage.setItem(tokenName, token);
  };

  /**
   * retrieves a token from local storage
   * @memberof AuthHelper
   */
  getToken = () => {
    // Retrieves the user token from localStorage
    return localStorage.getItem(tokenName);
  };

  logout = () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem(tokenName);
  };

  /**
   * get confirmation of token from local storage
   * @memberof AuthHelper
   */
  getConfirm = () => {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  };

  /**
   * wrap the request call with the authentication information
   * @param url the url to call for the request
   * @param options options to including in the request
   * @memberof AuthHelper
   */
  fetch = (url, options) => {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  };

  /**
   * check the status of the response
   * @param response response information form the request
   * @memberof AuthHelper
   */
  _checkStatus = response => {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}
