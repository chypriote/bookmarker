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
	var gamesCollection = req.db.get('gamescollection');
	var categoryCollection = req.db.get('gameCategories');

	async.parallel([
		function(callback) {gamesCollection.find({}, callback)},
		function(callback) {categoryCollection.find({}, callback)}
		], function(err, result) {
			res.render('games/list', {
				"gameList": result[0].reverse(),
				"categoryList": result[1],
				"title": "Liste des jeux disponibles"
			});
		});
});
router.get('/add', function(req, res) {
	var collection = req.db.get('gameCategories');
	collection.find({}, {}, function(e, docs){
		res.render('games/new', {
			"title":"Ajouter un jeu",
			"categoryList": docs
		});
	});
});

router.get('/categories', function(req, res) {
	var collection = req.db.get('gameCategories');
	collection.find({}, {}, function(e, docs){
		res.render('category', {
			"title":"Ajouter une catégorie de jeu",
			"categoryList": docs
		});
	});
});
router.post('/categories', function(req, res) {
	var	pCategory = req.body.postCategory;
	var collection = req.db.get('gameCategories');

	collection.insert({
		"name":pCategory,
		"nb":0
	}, function(err, doc){
		if (err) {
			req.send("There was a problem adding the category to the database");
		} else {
			res.redirect('/games/categories');
		}
	});
});
router.delete('/categories/:id', function(req, res) {
	var collection = req.db.get('gameCategories');
	collection.remove({'_id':req.params.id}, function(err) {
		res.send((err === null) ? {msg:''} : {msg:'error: '+err});
	});
});

router.delete('/:id', function(req, res) {
	var collection = req.db.get('gamescollection');
	collection.remove({'_id':req.params.id}, function(err) {
		res.send((err === null) ? {msg:''} : {msg:'error: '+err});
	});
});
router.post('/', upload.single('inputImage'), function(req, res) {
	var	pName = req.body.inputName,
			pUrl = req.body.inputUrl,
			pDate = moment().format(),
			pDesc = req.body.inputDescription,
			pImage = req.file.path,
			pSize = req.body.inputSize,
			pCategory = req.body.inputCategory;
	if (typeof pCategory === 'string') {pCategory = [pCategory];}

	var collection = req.db.get('gamescollection');

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