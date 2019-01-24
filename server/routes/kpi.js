const kpiController = require('../controllers').kpi;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the kpi API!',
    }));

    app.post('/api/kpi', kpiController.create);

    // Retrieve a single person by Id
    app.get('/api/kpi/:id', kpiController.findById);

    // Update a person with id
    app.put('/api/kpi/:id', kpiController.update);

    app.get('/api/kpi', kpiController.list);
};