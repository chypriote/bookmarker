var express = require('express');
var router = express.Router();
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
	var webCollection = req.db.get('webCollection');
	var gamesCollection = req.db.get('gamesCollection');
	var pluginsCollection = req.db.get('pluginsCollection');
	var vuejsCollection = req.db.get('vuejsCollection');

	async.parallel([
		function(callback) {webCollection.find({}, callback)},
		function(callback) {gamesCollection.find({}, callback)},
		function(callback) {pluginsCollection.find({}, callback)},
		function(callback) {vuejsCollection.find({}, callback)}
	], function(err, result) {

		var arresult = result[0].concat(result[1]).concat(result[3]);
		var totalPage = Math.floor(arresult.length / 10);

		arresult = arresult.sort(function(a, b) {
			return a['date'] < b ['date'] ? 1 : (a['date'] > b['date'] ? -1 : 0);
		}).slice(0, 10);


		res.render('index', {
			"completeList": arresult,
			"title": "ChypRiotE",
			"page": 0,
			"total": totalPage
		});
	});
});

router.get('/page-:page', function(req, res, next) {
	var webCollection = req.db.get('webCollection');
	var gamesCollection = req.db.get('gamesCollection');
	var pluginsCollection = req.db.get('pluginsCollection');
	var vuejsCollection = req.db.get('vuejsCollection');
	var currentPage = req.params.page - 1;

	async.parallel([
		function(callback) {webCollection.find({}, callback)},
		function(callback) {gamesCollection.find({}, callback)},
		function(callback) {pluginsCollection.find({}, callback)},
		function(callback) {vuejsCollection.find({}, callback)}
	], function(err, result) {

		var arresult = result[0].concat(result[1]).concat(result[3]);
		var totalPage = Math.floor(arresult.length / 10) + 1;

		arresult = arresult.sort(function(a, b) {
			return a['date'] < b ['date'] ? 1 : (a['date'] > b['date'] ? -1 : 0);
		}).slice(currentPage * 10, currentPage * 10 + 10);


		res.render('index', {
			"completeList": arresult,
			"title": "ChypRiotE",
			"page": currentPage,
			"total": totalPage
		});
	});
});

module.exports = router;
