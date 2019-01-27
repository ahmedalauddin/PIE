const projectController = require('../controllers').project;

module.exports = (app) => {
     app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the project API!',
     }));

    // Create a project
    app.post('/api/project', projectController.create);

    app.get('/api/project', projectController.list);

    // Retrieve a single project by Id
    app.get('/api/project/:id', projectController.findById);

    // Update a project with id
    app.put('/api/project/:id', projectController.update);
};