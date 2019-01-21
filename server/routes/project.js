const projectController = require('../controllers').project;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the project API!',
    }));

    app.post('/api/project', projectController.create);

    app.get('/api/project', projectController.list);
};