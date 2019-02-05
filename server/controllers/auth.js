const Person = require('../models').Person;
const bCrypt = require('bcrypt');
const passport = require('passport');


module.exports = {
    authenticate(req, res) {
        console.log('Body: ' + JSON.stringify(req.body));

        // Find a person by username.
        var results = {};
        console.log('username is: ' + req.body.username);
        Person.findOne({where: {
            username: req.body.username }}
            )
           .then(person => {
                console.log('Success, found person, pwdhash:' + person.pwdhash);
                console.log('Will run bCrypt compare.');

                bCrypt.compare(req.body.password, person.pwdhash, function (err, result) {
                    if (result === true) {
                        console.log('Success, logged in');
                        res.append('result', 'logged in');
                    } else {
                        console.log('Login failed');
                        res.send('Incorrect password');
                        res.append('result', 'login failed');
                    }
                });
            })
            .catch(failed => {
                console.log('Did not find username');
                res.redirect('/');
            });
    },

    /*
    signin(req, res) {
        passport.authenticate('local-signin', {
            successRedirect: '/dashboard',
            failureRedirect: '/login'
        });
    },

    signup(req, res) {
        console.log('passport.authenticate.');
        passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        });
    },
    */

};
/*
    dashboard(req, res);
{
    res.render('dashboard');
}
,

logout(req, res);
{
    res.render('logout');
}
,


}
;
*/