const Person = require('../models').Person;
const bCrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let config = require('../config');
let middleware = require('../middleware');

module.exports = {
    authenticate(req, res) {
        console.log('Body: ' + JSON.stringify(req.body));
        // Find a person by username.
        var results = {};
        console.log('username is: ' + req.body.username);
        Person.findOne({
                where: {
                    username: req.body.username
                }
            }
        ).then(Person => {
            console.log('Success, found person, pwdhash:' + Person.pwdhash);
            console.log('Will run bCrypt compare.');

            bCrypt.compare(req.body.password, Person.pwdhash, function (err, result) {
                if (result === true) {
                    // Logged in successfully.
                    console.log('Logged in successfully.');
                    let token = jwt.sign({username: Person.username},
                        config.secret,
                        {
                            expiresIn: '24h' // expires in 24 hours
                        }
                    );
                    // return the JWT token for the future API calls
                    console.log('Token set.');
                    res.status(200).send({ auth: true, message: 'Authorized.', token: token });
                    console.log('JSON result set.');
                } else {
                    // Login failed.
                    console.log('Login failed.');
                    res.status(200).send({ auth: false, message: 'No token.' });
                }
            });
        }).catch(failed => {
            res.status(400).send({ auth: false, message: 'Failed.' });
        });
    },

    index(req, res) {
        res.json({
            success: true,
            message: 'Index page'
        });
    }

};