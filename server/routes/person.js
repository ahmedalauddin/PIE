const personController = require('../controllers').person;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the person API!',
    }));

    app.post('/api/person', personController.create);

    app.get('/api/person', personController.list);
};