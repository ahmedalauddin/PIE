const Person = require('../models').Person;

module.exports = {
    signup: function(req, res) {
        res.render('signup');
    }
};
