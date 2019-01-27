const organizationController = require('../controllers').organization;

module.exports = (app) => {
    // app.get('/api', (req, res) => res.status(200).send({
    //     message: 'Welcome to the organization API!',
    // }));

    app.post('/api/organization', organizationController.create);

    app.get('/api/organization', organizationController.list);

};