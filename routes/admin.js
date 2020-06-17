var express = require('express');
var router = express.Router();

router.get('/games', function(req, res) {
	const collection = req.db.get('gamesCollection');
	collection.find({}, {}, function(e, docs){
		res.render('admin', {
			"title":"Administration des jeux",
			"postList": docs,
			"route": "games"
		});
	});
});

router.get('/plugins', function(req, res) {
	const collection = req.db.get('pluginsCollection');
	collection.find({}, {}, function(e, docs){
		res.render('admin', {
			"title":"Administration des plugins",
			"postList": docs,
			"route": "plugins"
		});
	});
});

router.get('/web', function(req, res) {
	const collection = req.db.get('webCollection');
	collection.find({}, {}, function(e, docs){
		res.render('admin', {
			"title":"Administration des web",
			"postList": docs,
			"route": "web"
		});
	});
});

router.get('/vuejs', function(req, res) {
	const collection = req.db.get('vuejsCollection');
	collection.find({}, {}, function(e, docs){
		res.render('admin', {
			"title":"Administration des vuejs",
			"postList": docs,
			"route": "vuejs"
		});
	});
});

module.exports = router;