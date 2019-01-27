const authController = require('../controllers').auth;

module.exports = function(app) {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the auth API!',
    }));

    //app.get('/api/signup', authController.signup);

    //app.get('/api/signin', authController.signin);

    // TODO
    app.post('/api/signup', authController.signup);

    app.get('/dashboard',isLoggedIn, authController.dashboard);

    app.get('/api/logout', authController.logout);

    app.post('/api/signin', authController.signin);

    // TODO need is logged check first on signup

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        // This is React's component.
        res.redirect('/signin');
    }
};