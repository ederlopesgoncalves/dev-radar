const { Router } = require('express');

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs', DevController.index);
//update dev
routes.get('/devs/:user_id', DevController.indexById);
routes.post('/devs', DevController.store);
routes.put('/devs', DevController.update);

routes.get('/search', SearchController.index);

module.exports = routes;
