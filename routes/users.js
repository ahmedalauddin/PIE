var express = require('express');
var router = express.Router();
const Person = require('../models/person');
const sequelize = require('../sequelize');

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
    res.json([{
        id: 1,
        full_name: "Darrin Tisdale",
        username: "darrintisdale"
    }, {
        id: 2,
        full_name: "Brad Kaufman",
        username: "bradkaufman"
    }, {
        id: 3,
        full_name: "John Jones",
        username: "johnjones"
    }]);
}); */

router.get('/', function(req, res, next) {
    // Get some users to test sequelize.
    // try this
    Person.findAll({
        attributes: ['id', 'full_name']
    });
});

module.exports = router;