const authController = require('../controllers').auth;

module.exports = function(app, passport) {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the auth API!',
    }));

    app.get('/api/signup', authController.signup);

    app.get('/api/signin', authController.signin);

    // TODO - This needs to be changed.
    app.post('/api/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup'
    }
    ));

    app.get('/dashboard',isLoggedIn, authController.dashboard);

    app.get('/api/logout', authController.logout);

    app.post('/api/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'}
    ));

    // TO DO need is logged check first on signup

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        // This is React's component.
        res.redirect('/signin');
    }
};