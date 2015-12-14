var express = require('express');
var async = require('async');
var router = express.Router();

// List of categories
router.get('/', function(req, res) {
	var postCategories = req.db.get('postCategories');
	var gameCategories = req.db.get('gameCategories');

	async.parallel([
		function(callback) {postCategories.find({}, callback)},
		function(callback) {gameCategories.find({}, callback)}
		], function(err, result) {
			res.render('category', {
				"postCategories": result[0],
				"gameCategories": result[1],
				"title": "Liste des jeux disponibles"
			});
		});
});
router.get('/add', function(req, res) {
	var collection = req.db.get('postCategories');
	collection.find({}, {}, function(e, docs){
		res.render('category', {
			"categoryList": docs,
			"title": "Ajouter une catégorie"
		});
	});
});

//delete category
router.delete('/:id', function(req, res) {
	var collection = req.db.get('postCategories');
	collection.remove({'_id':req.params.id}, function(err) {
		res.send((err === null) ? {msg:''} : {msg:'error: '+err});
	});
});

//add category
router.post('/', function(req, res) {
	var	pCategory = req.body.postCategory.toLowerCase();
	var collection = req.db.get('postCategories');

	collection.insert({
		"name":pCategory
	}, function(err, doc){
		if (err) {
			req.send("There was a problem adding the category to the database");
		} else {
			res.redirect('/category');
		}
	});
});


module.exports = router;