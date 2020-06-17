const express = require('express');
const router = express.Router();
const moment = require("moment");
	moment.locale('fr');

const multer = require('multer');
	const storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './public/images/jeux');
	  },
	  filename: function (req, file, cb) {
	    cb(null, file.originalname);
	  }
	});
	const upload = multer({storage: storage});

// List of posts
router.get('/', async (req, res) => {
	const gamesCollection = req.db.get('gamesCollection');
	const categoryCollection = req.db.get('gamesCategories');

	const [posts, categories] = await Promise.all([
		gamesCollection.find({}),
		categoryCollection.find({}),
	])
	
	return res.render('list', {
		"postList": posts.reverse(),
		"categoryList": categories,
		"title": "Liste des jeux",
		"route": "games"
	});
});

router.get('/add', async(req, res) => {
	const docs = await req.db.get('gamesCategories').find({}, {});

	return res.render('new', {
		"title":"Ajouter un jeu",
		"categoryList": docs,
		"type" : "games"
	});
});

router.post('/', upload.single('inputImage'), async (req, res) => {
	const	pTitle = req.body.inputTitle,
			pUrl = req.body.inputUrl,
			pDate = moment().format(),
			pDesc = req.body.inputDescription,
			pSize = req.body.inputSize,
			pCategory = req.body.inputCategory;
	if (typeof pCategory === 'string') {pCategory = [pCategory];}
	let pimage = "";
	if (req.file) pImage = req.file.path;

	try {
		await req.db.get('gamesCollection').insert({
			"title":pTitle,
			"url":pUrl,
			"date":pDate,
			"description":pDesc,
			"image":pImage.replace('public', ''),
			"size": pSize,
			"categories":pCategory,
			"type":"games"
		})

		return res.redirect('/games');
	} catch (err) {
		next(err);
	}
});

// Categories
router.get('/categories', async (req, res) => {
	const docs = await req.db.get('gamesCategories').find({}, {})
	
	return res.render('category', {
		"title":"Ajouter une catégorie de jeu",
		"categoryList": docs
	});
});

router.post('/categories', function(req, res) {
	const	pCategory = req.body.postCategory;
	const collection = req.db.get('gamesCategories');

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
	const collection = req.db.get('gamesCategories');
	collection.remove({'_id':req.params.id}, function(err) {
		res.send((err === null) ? {msg:''} : {msg:'error: '+err});
	});
});

// Gestion item
router.get('/edit/:id', async function(req, res) {
	const gamesCollection = req.db.get('gamesCollection');
	const categoryCollection = req.db.get('gamesCategories');

	await Promise.all([
		function(callback) {gamesCollection.find({'_id':req.params.id}, callback)},
		function(callback) {categoryCollection.find({}, callback)}
		], function(err, result) {
			const item = result[0][0];
			res.render('single', {
				"item": item,
				"categoryList": result[1],
				"title": item.title
			});
		});
});
router.delete('/edit/:id', function(req, res) {
	const collection = req.db.get('gamesCollection');
	collection.remove({'_id':req.params.id}, function(err) {
		res.send((err === null) ? {msg:''} : {msg:'error: '+err});
	});
});
router.post('/edit/:id', upload.single('inputImage'), function(req, res) {
	const	pTitle = req.body.inputTitle,
			pUrl = req.body.inputUrl,
			pDate = moment().format(),
			pDesc = req.body.inputDescription,
			pSize = req.body.inputSize,
			pCategory = req.body.inputCategory;
	let 	pImage = "";
	if (typeof pCategory === 'string') {pCategory = [pCategory];}
	if (req.body.oldImage != null)
			pImage = req.body.oldImage;
	else
		if (req.file) {pImage = req.file.path;}

	req.db.get('gamesCollection').update({"_id":req.params.id},
		{$set:{
			"title":pTitle,
			"url":pUrl,
			"date":pDate,
			"description":pDesc,
			"image":pImage.replace('public', ''),
			"size": pSize,
			"categories":pCategory,
			"type": "games"
		}}, function(err, doc) {
			if (err)
				next(err);
			else
				res.redirect("/admin/games");
	});
});



module.exports = router;