const authController = require('../controllers').auth;

module.exports = function(app) {
    app.post('/api/authenticate', authController.authenticate);

    //app.get('/api/checktoken', middleware.checkToken);


    //app.post('/api/signin', authController.signin);

    //app.post('/api/signup', authController.signup);

    //app.get('/dashboard',isLoggedIn, authController.dashboard);

    //app.get('/api/logout', authController.logout);

    //app.post('/api/signin', authController.signin);

    // TODO need is logged check first on signup
    /*
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/signin');
    }
    */
};

