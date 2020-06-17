const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
	const webCollection = req.db.get('webCollection');
	const gamesCollection = req.db.get('gamesCollection');
	const pluginsCollection = req.db.get('pluginsCollection');
	const vuejsCollection = req.db.get('vuejsCollection');

	await Promise.all([
		function(callback) {webCollection.find({}, callback)},
		function(callback) {gamesCollection.find({}, callback)},
		function(callback) {pluginsCollection.find({}, callback)},
		function(callback) {vuejsCollection.find({}, callback)}
	], function(err, result) {

		const arresult = result[0].concat(result[1]).concat(result[3]);
		const totalPage = Math.floor(arresult.length / 10);

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

router.get('/page-:page', async function(req, res, next) {
	const webCollection = req.db.get('webCollection');
	const gamesCollection = req.db.get('gamesCollection');
	const pluginsCollection = req.db.get('pluginsCollection');
	const vuejsCollection = req.db.get('vuejsCollection');
	const currentPage = req.params.page - 1;

	await Promise.all([
		function(callback) {webCollection.find({}, callback)},
		function(callback) {gamesCollection.find({}, callback)},
		function(callback) {pluginsCollection.find({}, callback)},
		function(callback) {vuejsCollection.find({}, callback)}
	], function(err, result) {

		const arresult = result[0].concat(result[1]).concat(result[3]);
		const totalPage = Math.floor(arresult.length / 10) + 1;

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
