var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json([{
        id: 1,
        full_name: "Darrin Tisdale",
        username: "darrintisdale"
    }, {
        id: 2,
        username: "Brad Kaufman",
        username: "bradkaufman"
    }]);
});

module.exports = router;