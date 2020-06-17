const express = require('express');
const router = express.Router();
const moment = require("moment");
		moment.locale('fr');

const multer = require('multer');
	const storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './public/images/logos');
	  },
	  filename: function (req, file, cb) {
	    cb(null, file.originalname);
	  }
	});
	const upload = multer({storage: storage});

// List of posts
router.get('/', async function(req, res) {
	const vuejsCollection = req.db.get('vuejsCollection');
	const categoryCollection = req.db.get('vuejsCategories');

	await Promise.all([
		function(callback) {vuejsCollection.find({}, callback)},
		function(callback) {categoryCollection.find({}, callback)}
		], function(err, result) {
			res.render('list', {
				"postList": result[0].reverse(),
				"categoryList": result[1],
				"title": "Liste des vuejs",
				"route": "vuejs"
			});
		});
});
router.get('/add', function(req, res) {
	const collection = req.db.get('vuejsCategories');
	collection.find({}, {}, function(e, docs){
		res.render('new', {
			"title":"Ajouter un vuejs",
			"categoryList": docs,
			"type" : "vuejs"
		});
	})
});
router.post('/', upload.single('inputImage'), function(req, res) {
	const pTitle = req.body.inputTitle,
			pUrl = req.body.inputUrl,
			pDate = moment().format(),
			pDesc = req.body.inputDescription,
			pCategory = req.body.inputCategory;
	if (typeof pCategory === 'string') {pCategory = [pCategory];}
	let pImage = "";
	if (req.file) pImage = req.file.path;

	const collection = req.db.get('vuejsCollection');

	collection.insert({
		"title":pTitle,
		"url":pUrl,
		"date":pDate,
		"description":pDesc,
		"image":pImage.replace('public', ''),
		"categories":pCategory,
		"type":"vuejs"
	}, function(err, doc){
		if (err) {
			next(err);
		} else {
			res.redirect('/vuejs');
		}
	});
});

// Categories
	router.get('/categories', function(req, res) {
		const collection = req.db.get('vuejsCategories');
		collection.find({}, {}, function(e, docs){
			res.render('category', {
				"title":"Ajouter une catégorie",
				"categoryList": docs
			});
		});
	});
	router.post('/categories', function(req, res) {
		const pCategory = req.body.postCategory;
		const collection = req.db.get('vuejsCategories');

		collection.insert({
			"name": pCategory,
			"nb": 0
		}, function(err, doc){
			if (err) {
				req.send("There was a problem adding the category to the database");
			} else {
				res.redirect('/vuejs/add');
			}
		});
	});
	router.delete('/categories/:id', function(req, res) {
		const collection = req.db.get('vuejsCategories');
		collection.remove({'_id':req.params.id}, function(err) {
			res.send((err === null) ? {msg:''} : {msg:'error: '+err});
		});
	});

// Gestion item
	router.get('/edit/:id', async function(req, res) {
		const vuejsCollection = req.db.get('vuejsCollection');
		const categoryCollection = req.db.get('vuejsCategories');

		const result = await Promise.all([
			function(callback) {vuejsCollection.find({'_id':req.params.id}, callback)},
			function(callback) {categoryCollection.find({}, callback)}
			])

		const item = result[0][0];
		return res.render('single', {
			"item":item,
			"categoryList": result[1],
			"title": item.title
		});
	});
	router.delete('/edit/:id', function(req, res) {
		const collection = req.db.get('vuejsCollection');
		collection.remove({'_id':req.params.id}, function(err) {
			res.send((err === null) ? {msg:''} : {msg:'error: '+err});
		});
	});
	router.post('/edit/:id', upload.single('inputImage'), function(req, res) {
		const	pTitle = req.body.inputTitle,
				pUrl = req.body.inputUrl,
				pDate = moment().format(),
				pDesc = req.body.inputDescription,
				pCategory = req.body.inputCategory;
		let 	pImage = "";
		if (typeof pCategory === 'string') {pCategory = [pCategory];}
		if (req.body.oldImage != null)
				pImage = req.body.oldImage;
		else
			if (req.file) {pImage = req.file.path;}

		req.db.get('vuejsCollection').update({"_id":req.params.id},
			{$set:{
				"title":pTitle,
				"url":pUrl,
				"date":pDate,
				"description":pDesc,
				"image":pImage.replace('public', ''),
				"categories":pCategory,
				"type": "vuejs"
			}}, function(err, doc) {
				if (err)
					next(err);
				else
					res.redirect("/admin/vuejs");
		});
	});



module.exports = router;
