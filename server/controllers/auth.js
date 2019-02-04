const Person = require('../models').Person;
const bCrypt = require('bcrypt');
/*
const passport = require('passport');
*/

module.exports = {
    authenticate(req, res) {
        console.log('Body: ' + JSON.stringify(req.params));

        var person = {};
        // Find a person by username.
        Person
            .findOne({where: {username: req.params.username}})
            .then(person => {
                console.log('Success, found person, pwdhash:' + person.pwdhash);
                console.log('Will run bCrypt compare.');
                bCrypt.compare(req.params.password, person.pwdhash, function (err, result) {
                    if (result == true) {
                        res.redirect('/home');
                    } else {
                        res.send('Incorrect password');
                        res.redirect('/');
                    }
                })
            })
            .catch( failed => {
                console.log('Did not find username');
                res.redirect('/');
            });
    },
};



/*
                    signin(req, res)
            {
                passport.authenticate('local-signin', {
                    successRedirect: '/dashboard',
                    failureRedirect: '/login'
                });
            }
        ,

            signup(req, res);
            {
                passport.authenticate('local-signup', {
                    successRedirect: '/dashboard',
                    failureRedirect: '/signup'
                });
            }
        ,

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
*/


