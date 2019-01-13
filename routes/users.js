var express = require('express');
var router = express.Router();


// Use the Sequelize connection pool.

// Load the MySQL pool connection
//const pool = require('../data/config');

User.findAll().then(users => {
  console.log(users)
})

module.exports = router;

