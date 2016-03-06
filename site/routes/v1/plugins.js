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
	var pluginsCollection = req.db.get('pluginsCollection');
	var categoryCollection = req.db.get('pluginsCategories');

	async.parallel([
		function(callback) {pluginsCollection.find({}, callback)},
		function(callback) {categoryCollection.find({}, callback)}
		], function(err, result) {
			res.render('list', {
				"postList": result[0].reverse(),
				"categoryList": result[1],
				"title": "Liste des plugins",
				"route": "plugins"
			});
		});
});
router.get('/add', function(req, res) {
	var collection = req.db.get('pluginsCategories');
	collection.find({}, {}, function(e, docs){
		res.render('new', {
			"title":"Ajouter un plugin",
			"categoryList": docs,
			"type" : "plugins"
		});
	})
});
router.post('/', upload.single('inputImage'), function(req, res) {
	var pTitle = req.body.inputTitle,
			pUrl = req.body.inputUrl,
			pDate = moment().format(),
			pDesc = req.body.inputDescription,
			pCategory = req.body.inputCategory;
	if (typeof pCategory === 'string') {pCategory = [pCategory];}
	var pImage = "";
	if (req.file) pImage = req.file.path;

	var collection = req.db.get('pluginsCollection');

	collection.insert({
		"title":pTitle,
		"url":pUrl,
		"date":pDate,
		"description":pDesc,
		"image":pImage.replace('public', ''),
		"categories":pCategory,
		"type":"plugins"
	}, function(err, doc){
		if (err) {
			next(err);
		} else {
			res.redirect('/plugins');
		}
	});
});

// Categories
	router.get('/categories', function(req, res) {
		var collection = req.db.get('pluginsCategories');
		collection.find({}, {}, function(e, docs){
			res.render('category', {
				"title":"Ajouter une catégorie",
				"categoryList": docs
			});
		});
	});
	router.post('/categories', function(req, res) {
		var	pCategory = req.body.postCategory;
		var collection = req.db.get('pluginsCategories');

		collection.insert({
			"name":pCategory,
			"nb":0
		}, function(err, doc){
			if (err) {
				req.send("There was a problem adding the category to the database");
			} else {
				res.redirect('/plugins/add');
			}
		});
	});
	router.delete('/categories/:id', function(req, res) {
		var collection = req.db.get('pluginsCategories');
		collection.remove({'_id':req.params.id}, function(err) {
			res.send((err === null) ? {msg:''} : {msg:'error: '+err});
		});
	});

// Gestion item
	router.get('/edit/:id', function(req, res) {
		var pluginsCollection = req.db.get('pluginsCollection');
		var categoryCollection = req.db.get('pluginsCategories');

		async.parallel([
			function(callback) {pluginsCollection.find({'_id':req.params.id}, callback)},
			function(callback) {categoryCollection.find({}, callback)}
			], function(err, result) {
				var item = result[0][0];
				res.render('single', {
					"item":item,
					"categoryList": result[1],
					"title": item.title
				});
			});
	});
	router.delete('/edit/:id', function(req, res) {
		var collection = req.db.get('pluginsCollection');
		collection.remove({'_id':req.params.id}, function(err) {
			res.send((err === null) ? {msg:''} : {msg:'error: '+err});
		});
	});
	router.post('/edit/:id', upload.single('inputImage'), function(req, res) {
		var	pTitle = req.body.inputTitle,
				pUrl = req.body.inputUrl,
				pDate = moment().format(),
				pDesc = req.body.inputDescription,
				pCategory = req.body.inputCategory,
				pImage = "";
		if (typeof pCategory === 'string') {pCategory = [pCategory];}
		if (req.body.oldImage != null)
				pImage = req.body.oldImage;
		else
			if (req.file) {pImage = req.file.path;}

		req.db.get('pluginsCollection').update({"_id":req.params.id},
			{$set:{
				"title":pTitle,
				"url":pUrl,
				"date":pDate,
				"description":pDesc,
				"image":pImage.replace('public', ''),
				"categories":pCategory,
				"type": "plugins"
			}}, function(err, doc) {
				if (err)
					next(err);
				else
					res.redirect("/admin/plugins");
		});
	});



module.exports = router;
