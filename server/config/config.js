/**
 * Project: valueinfinity-mvp
 * File:    /server/config/config.js
 * Created: 2019-02-16 18:02:01
 * Author:  Darrin Tisdale
 * -----
 * Modified: 2019-02-18 16:33:33
 * Editor:   Darrin Tisdale
 */
"use strict";

// imports
import convict from "convict";

// read in the environment configuration
require("dotenv").config();

// structure the variables to be read in
export const config = convict("./schema.json");

// load the proper config variables, if they are in the json file
export const env = config.get("env");
config.loadFile(`./${env}.json`);

// throws error if config does not conform to schema
config.validate({ allowed: "strict" });

// get the secret and create a jwt secret
const secret = config.get("security.jwtSecret");
export const jwtMW = require("express-jwt")(secret);
