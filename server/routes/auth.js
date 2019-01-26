const authController = require('../controllers').auth;

module.exports = function(app, passport) {
    app.get('/signup', authController.signup);

    app.get('/signin', authController.signin);

    // This needs to be changed.
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        }
    ));

    app.get('/dashboard',isLoggedIn, authController.dashboard);

    app.get('/logout',authController.logout);

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'}
    ));

    // TODO need is logged check first on signup

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }
}