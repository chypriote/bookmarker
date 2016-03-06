var express = require('express');
var api = express.Router();

api.get('/', function(req, res, next) {
	res.send('Hello api');
});
api.use('/web', require('./web'));

api.get('/:name', function(req, res, next) {
	res.send('Hello ' + req.params.name);
});

//error handler for api
api.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send(err);
});

module.exports = api;