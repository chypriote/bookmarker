var express = require('express');
var router = express.Router();

router.get('/games', function(req, res) {
	var collection = req.db.get('gamesCollection');
	collection.find({}, {}, function(e, docs){
		res.render('admin', {
			"title":"Administration des jeux",
			"postList": docs,
			"route": "games"
		});
	});
});

router.get('/plugins', function(req, res) {
	var collection = req.db.get('pluginsCollection');
	collection.find({}, {}, function(e, docs){
		res.render('admin', {
			"title":"Administration des jeux",
			"postList": docs,
			"route": "games"
		});
	});
});

router.get('/web', function(req, res) {
	var collection = req.db.get('webCollection');
	collection.find({}, {}, function(e, docs){
		res.render('admin', {
			"title":"Administration des jeux",
			"postList": docs,
			"route": "games"
		});
	});
});

module.exports = router;