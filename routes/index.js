var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var collection = req.db.get('postcollection');
	collection.find({}, {}, function(e, docs){
		res.render('index', {
			"postList": docs,
			"title": "ChypRiotE"
		});
	});
});

module.exports = router;
