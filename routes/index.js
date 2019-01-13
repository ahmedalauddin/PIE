var express = require('express');
var router = express.Router();

// dependencies
const {Person, Organization, Kpi} = require('../sequelize');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'This is the Express app' });
});

// Get some users to test sequelize.
Person.findAll().then(person => {
  res.render('index', {title: 'Users:' + person});
})


module.exports = router;
