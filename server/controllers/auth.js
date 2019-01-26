
module.exports = {
    signup (req, res) {
        res.render('signup');
    },

    siginin (req, res) {
        res.render('signin');
    },

    dashboard (req, res) {
        res.render('dashboard');
    },

    logout (req, res) {
        res.render('logout');
    },

};
