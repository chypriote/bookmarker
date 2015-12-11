var express = require('express');
var router = express.Router();
var moment = require("moment");
moment.locale('fr');

// List of posts
router.get('/', function(req, res) {
	var collection = req.db.get('postcollection');
	collection.find({}, {}, function(e, docs){
		res.render('posts/list', {
			"postList": docs,
			"title": "List des posts"
		});
	});
});
router.get('/add', function(req, res) {
	var collection = req.db.get('categorycollection');
	collection.find({}, {}, function(e, docs){
		res.render('posts/new', {
			"title":"Ajouter un post",
			"categoryList": docs
		});
	})
});

//post by id
router.get('/:id', function(req, res) {
	var collection = req.db.get('postcollection');
	collection.find({'_id':req.params.id}, function(err) {
		res.send((err === null ? {msg:''} : {msg:'error: ' + err}));
	});
});
//delete post
router.delete('/:id', function(req, res) {
	var collection = req.db.get('postcollection');
	collection.remove({'_id':req.params.id}, function(err) {
		res.send((err === null) ? {msg:''} : {msg:'error: '+err});
	});
});

//add post
router.post('/', function(req, res) {
	var pTitle = req.body.postTitle,
			pDate = moment().format(),
			pUrl = req.body.postUrl,
			pBody = req.body.postBody,
			pImage = req.body.postImage,
			pCategory = req.body.postCategory;
	var collection = req.db.get('postcollection');
	if (typeof pCategory === 'string') {pCategory = [pCategory];}

	collection.insert({
		"title":pTitle,
		"url":pUrl,
		"date":pDate,
		"image":pImage,
		"body":pBody,
		"categories":pCategory
	}, function(err, doc){
		if (err) {
			req.send("There was a problem adding the post to the database");
		} else {
			res.redirect('/posts');
		}
	});
});


module.exports = router;
