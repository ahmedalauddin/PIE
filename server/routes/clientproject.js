const clientprojectController = require('../controllers').clientproject;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the clientproject API!',
    }));

    app.post('/api/clientproject', clientprojectController.create);

    app.get('/api/clientproject', clientprojectController.list);
};