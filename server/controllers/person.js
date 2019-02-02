const Person = require('../models').Person;
const Organization = require('../models').Organization;
const bCrypt = require('bcrypt-nodejs');
var express = require('express');
const bodyParser = require('body-parser');
const emailAddresses = require('email-addresses');
const OrgController = require('./organization');

function getHash(value) {
    var hashedValue = '';
    console.log('value  = ' + value);
    try {
        hashedValue = bCrypt.hash(value, 12);
    } catch {
        (error => {
            console.log(error.stack);
            res.status(400).send(error);
        });
    }
    console.log('hashedValue = ' + hashedValue);

    return hashedValue;
}

module.exports = {
    create(req, res) {
        //console.log(req.body);
        //let hashed = getHash(req.body.pwdhash);
        //console.log("hashed value = " + hashed);
        //let fullname = req.body.firstName + ' ' + req.body.lastName;
        // Get the user's org by email address.
        try {
            console.log('In person.Create');
            const orgResult = {};
            const emailParsed = emailAddresses.parseOneAddress(req.body.email);
            const domain = emailParsed.domain;
            domainarr = [];
            domainarr = domain.split('.');
            const company = domainarr[domainarr.length-2];
            console.log(domainarr.length);
            console.log('company is: ' + company);
            OrgController.findByName(orgResult, company)
                .then(console.log('org: ' + JSON.stringify(orgResult)))
                .catch(error => {
                    console.log(error.stack);
                    res.status(400).send(error);
                });
            console.log('Called OrgController');
            console.log('org: ' + JSON.stringify(orgResult));
        } catch {
            error.stackTrace;
        }


        return Person
            .create({
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                orgId: '2',
                email: req.body.email,
                pwdhash: req.body.pwdhash,
            })
            .then(person => {
                console.log('Adding person');
                res.status(201).send(person);
            })
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },

    // Update a person
    update(req, res) {
        const id = req.params.id;
        console.log(req.body);
        return Person
            .update({
                    username: req.body.username,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    pwdHash: req.body.pwdHash,
                    orgId: req.body.orgId,
                    logging: console.log,
                },
                {returning: true, where: {id: id}}
            ).then(person => res.status(200).send(person))
            .catch(error => res.status(400).send(error));
    },


    // Find a person by Id
    findById(req, res) {
        return Person
            .findById(req.params.id, {
                include: [{
                    model: Organization,
                    as: 'Organization',
                }],
            })
            .then(person => res.status(200).send(person))
            .catch(error => res.status(400).send(error));
    },

    // List all persons
    list(req, res) {
        return Person
            .findAll({
                include: [{
                    model: Organization,
                    as: 'Organization',
                }],
            })
            .then(person => res.status(200).send(person))
            .catch(error => {
                console.log(error.stack);
                res.status(400).send(error);
            });
    },
};