var express = require('express');
var router = express.Router();
// dependencies
const {Person, Organization, Kpi} = require('./sequelize');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get some users to test sequelize.
Person.findAll().then(person => {
  console.log(person)
})

module.exports = router;
