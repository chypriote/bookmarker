var express = require('express');

var async = require('async');
var router = express.Router();
var moment = require("moment");
		moment.locale('fr');

var multer = require('multer');
	var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './public/images/logos');
	  },
	  filename: function (req, file, cb) {
	    cb(null, file.originalname);
	  }
	});
	var upload = multer({storage: storage});

// List of posts
router.get('/', function(req, res) {
	var postCollection = req.db.get('postCollection');
	var categoryCollection = req.db.get('postCategories');

	async.parallel([
		function(callback) {postCollection.find({}, callback)},
		function(callback) {categoryCollection.find({}, callback)}
		], function(err, result) {
			res.render('list-posts', {
				"postList": result[0].reverse(),
				"categoryList": result[1],
				"title": "Liste des posts",
				"route": "posts"
			});
		});
});
router.get('/add', function(req, res) {
	var collection = req.db.get('postCategories');
	collection.find({}, {}, function(e, docs){
		res.render('new-posts', {
			"title":"Ajouter un post",
			"categoryList": docs
		});
	})
});

// Categories
	router.get('/categories', function(req, res) {
		var collection = req.db.get('postCategories');
		collection.find({}, {}, function(e, docs){
			res.render('category', {
				"title":"Ajouter une catégorie",
				"categoryList": docs
			});
		});
	});
	router.post('/categories', function(req, res) {
		var	pCategory = req.body.postCategory;
		var collection = req.db.get('postCategories');

		collection.insert({
			"name":pCategory,
			"nb":0
		}, function(err, doc){
			if (err) {
				req.send("There was a problem adding the category to the database");
			} else {
				res.redirect('/posts/add');
			}
		});
	});
	router.delete('/categories/:id', function(req, res) {
		var collection = req.db.get('postCategories');
		collection.remove({'_id':req.params.id}, function(err) {
			res.send((err === null) ? {msg:''} : {msg:'error: '+err});
		});
	});

router.delete('/:id', function(req, res) {
	var collection = req.db.get('postCollection');
	collection.remove({'_id':req.params.id}, function(err) {
		res.send((err === null) ? {msg:''} : {msg:'error: '+err});
	});
});

router.post('/', upload.single('inputImage'), function(req, res) {
	var pTitle = req.body.inputTitle,
			pDate = moment().format(),
			pUrl = req.body.inputUrl,
			pBody = req.body.inputBody,
			pCategory = req.body.inputCategory;
	var collection = req.db.get('postCollection');
	if (typeof pCategory === 'string') {pCategory = [pCategory];}
	var pImage = "";
	if (req.file) pImage = req.file.path;

	collection.insert({
		"title":pTitle,
		"url":pUrl,
		"date":pDate,
		"body":pBody,
		"image":pImage.replace('public', ''),
		"categories":pCategory
	}, function(err, doc){
		if (err) {
			next(err);
		} else {
			res.redirect('/posts');
		}
	});
});


module.exports = router;
