const personController = require('../controllers').person;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the person API!',
    }));

    app.post('/api/person', personController.create);

    // Retrieve a single person by Id
    app.get('/api/person/:id', personController.findById);

    // Update a person with id
    app.put('/api/person/:id', personController.update);

    app.get('/api/person', personController.list);
};