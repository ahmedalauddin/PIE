var express = require('express');
var router = express.Router();

// dependencies
const {Person, Organization, Kpi} = require('../sequelize');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'This is the Express app' });
});


module.exports = router;
