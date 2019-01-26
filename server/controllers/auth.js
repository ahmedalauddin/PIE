const passport = require('passport');

module.exports = {
    signin (req, res) {
        passport.authenticate('local-signin', {
            successRedirect: '/dashboard',
            failureRedirect: '/login'
        });
    },

    signup (req, res) {
        passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        });
    },

    dashboard (req, res) {
        res.render('dashboard');
    },

    logout (req, res) {
        res.render('logout');
    },

};
