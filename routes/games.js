var express = require('express');

var async = require('async');
var router = express.Router();
var moment = require("moment");
		moment.locale('fr');

var multer = require('multer');
	var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './public/images/jeux');
	  },
	  filename: function (req, file, cb) {
	    cb(null, file.originalname);
	  }
	});
	var upload = multer({storage: storage});


router.get('/', function(req, res) {
	var gamesCollection = req.db.get('gamesCollection');
	var categoryCollection = req.db.get('gamesCategories');

	async.parallel([
		function(callback) {gamesCollection.find({}, callback)},
		function(callback) {categoryCollection.find({}, callback)}
		], function(err, result) {
			res.render('list-games', {
				"gameList": result[0].reverse(),
				"categoryList": result[1],
				"title": "Liste des jeux disponibles",
				"route": "games"
			});
		});
});
router.get('/add', function(req, res) {
	var collection = req.db.get('gamesCategories');
	collection.find({}, {}, function(e, docs){
		res.render('new-games', {
			"title":"Ajouter un jeu",
			"categoryList": docs
		});
	});
});

// Categories
	router.get('/categories', function(req, res) {
		var collection = req.db.get('gamesCategories');
		collection.find({}, {}, function(e, docs){
			res.render('category', {
				"title":"Ajouter une catégorie de jeu",
				"categoryList": docs
			});
		});
	});
	router.post('/categories', function(req, res) {
		var	pCategory = req.body.postCategory;
		var collection = req.db.get('gamesCategories');

		collection.insert({
			"name":pCategory,
			"nb":0
		}, function(err, doc){
			if (err) {
				req.send("There was a problem adding the category to the database");
			} else {
				res.redirect('/games/add');
			}
		});
	});
	router.delete('/categories/:id', function(req, res) {
		var collection = req.db.get('gamesCategories');
		collection.remove({'_id':req.params.id}, function(err) {
			res.send((err === null) ? {msg:''} : {msg:'error: '+err});
		});
	});

router.delete('/:id', function(req, res) {
	var collection = req.db.get('gamesCollection');
	collection.remove({'_id':req.params.id}, function(err) {
		res.send((err === null) ? {msg:''} : {msg:'error: '+err});
	});
});
router.post('/', upload.single('inputImage'), function(req, res) {
	var	pName = req.body.inputName,
			pUrl = req.body.inputUrl,
			pDate = moment().format(),
			pDesc = req.body.inputDescription,
			pSize = req.body.inputSize,
			pCategory = req.body.inputCategory;
	if (typeof pCategory === 'string') {pCategory = [pCategory];}
	var pImage = "";
	if (req.file) pImage = req.file.path;

	var collection = req.db.get('gamesCollection');

	collection.insert({
		"name":pName,
		"url":pUrl,
		"date":pDate,
		"description":pDesc,
		"image":pImage.replace('public', ''),
		"size": pSize,
		"categories":pCategory
	}, function(err, doc){
		if (err) {
			next(err);
		} else {
			res.redirect('/games');
		}
	});
});


module.exports = router;