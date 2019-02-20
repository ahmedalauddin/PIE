const Person = require("../models").Person;
const bCrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const jwtconfig = require("../config/jwtconfig");

module.exports = {
  authenticate(req, res) {
    console.log("Body: " + JSON.stringify(req.body));
    // Find a person by username.
    var results = {};
    console.log("username is: " + req.body.username);
    Person.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(Person => {
        console.log("Success, found person, pwdhash:" + Person.pwdhash);
        console.log("Will run bCrypt compare.");

        bCrypt.compare(req.body.password, Person.pwdhash, function(
          err,
          result
        ) {
          if (result === true) {
            // Logged in successfully.
            console.log("Logged in successfully.");
            let token = jwt.sign(
              { username: Person.username },
              jwtconfig.jwtMW.secret,
              {
                expiresIn: "24h" // expires in 24 hours
              }
            );
            // return the JWT token for the future API calls
            res.json({
              sucess: true,
              err: null,
              token
            });
          } else {
            // Login failed.
            console.log("Login failed.");
            res.status(401).json({
              sucess: false,
              token: null,
              err: "Username or password is incorrect"
            });
          }
        });
      })
      .catch(failed => {
        res.status(400).send({ auth: false, message: "Failed." });
      });
  },

  index(req, res) {
    res.json({
      success: true,
      message: "Index page"
    });
  }
};
