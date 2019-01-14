var express = require('express');
const PersonModel = require('./models/person');

var router = express.Router();
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
});
*/
const Person = PersonModel(sequelize, Sequelize);

router.get('/', function(req, res, next) {
    // Get some users to test sequelize.
    Person.findAll({
        attributes: ['id', 'full_name']
    });
});

module.exports = router;