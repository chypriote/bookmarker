var express = require('express');
var router = express.Router();

// List of categories
router.get('/', function(req, res) {
	var collection = req.db.get('categorycollection');
	collection.find({}, {}, function(e, docs){
		res.render('category', {
			"categoryList": docs,
			"title": "Liste des catégories"
		});
	});
});

//category by name
router.get('/:name', function(req, res) {
	var collection = req.db.get('postcollection');
	collection.find({'categories':req.params.name}, function(e, docs){
		res.render('index', {
			"postList": docs,
			"title": "Posts dans la catégorie " + req.params.name
		});
	});
});

//delete category
router.delete('/:id', function(req, res) {
	var collection = req.db.get('categorycollection');
	collection.remove({'_id':req.params.id}, function(err) {
		res.send((err === null) ? {msg:''} : {msg:'error: '+err});
	});
});

//add category
router.post('/', function(req, res) {
	var	pCategory = req.body.postCategory.toLowerCase();
	var collection = req.db.get('categorycollection');

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