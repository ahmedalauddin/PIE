const mindmapController = require('../controllers').mindmap;
require('./index');

module.exports = (app) => {

    // create a mindmap
    app.post('/api/mindmap', mindmapController.create);

    // get all mindmaps
    app.get('/api/mindmap', mindmapController.list);

    // get a mindmap by id
    app.get('/api/mindmap/:id', mindmapController.findById);

    // get a mindmap by the orgId
    app.get('/api/mindmap/?orgId=:orgId', mindmapController.findByOrgId);

    // update a mindmap
    app.put('/api/mindmap/:id', mindmapController.update);

    // delete a mindmap
    app.delete('/api/mindmap/:id', mindmapController.delete);

};