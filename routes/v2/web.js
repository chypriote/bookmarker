var express = require('express');
var router = express.Router();
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
var moment = require('moment');
		moment.locale('fr');

function createPost(datas) {
	var post = {};

	post.title = datas.inputTitle;
	post.date = moment().format(),
	post.url = datas.inputUrl,
	post.description = datas.inputDescription,
	post.category = datas.inputCategory;
	if (req.file) {
		post.image = datas.file.path;
		post.image = post.image.replace('public', '');
	} else {
		post.image = "";
	}
	if (typeof post.category === 'string') {
		post.category = [post.category];
	}
	return post;
}

router
.get('/', function(req, res) {
	req.db.get('webCollection').find({})
		.success(function(data) {
			res.send(data);
		})
		.error(function(err) {
			next(err);
		});
})
.get('/categories', function (req, res, next) {
	req.db.get('webCategories').find({})
		.success(function (data) {
			res.send(data);
		})
		.error(function (err) {
			next({error:err, message: 'server error'});
		});
})
.get('/categories/:id', function (req, res, next) {
	req.db.get('webCategories').find({_id:req.params.id})
		.success(function(data) {
			if (data[0])
				res.send(data[0]);
			else
				next({status:401, error: 'category not found'});
		})
		.error(function(err) {
			next({error:err, message: 'server error'});
		});
})
.post('/categories', function (req, res, next) {
	var category = req.body.postCategory;
	req.db.get('webCategories').insert({
		name: category,
		nb: 0
	}).success(function (data) {
		res.send(data);
	}).error(function (err) {
		next({error: err, message: 'server error'});
	});
})
.put('/categories/:id', function (req, res, next) {
	var category = req.body.postCategory;
	req.db.get('webCategories')
	.update({'_id':req.params.id},{$set:{name:category}})
	.success(function () {res.send();})
	.error(function (err) {
		next({error: err, message: 'server error'});
	});
})
.delete('/categories/:id', function (req, res, next) {
	req.db.get('webCategories')
		.remove({_id: req.params.id})
		.success(function() {res.send();})
		.error(function (err) {
			next({error: err, message: 'server error'});
		});
})

.get('/:id', function (req, res) {
	req.db.get('webCollection')
		.find({_id:req.params.id})
		.success(function(data) {
			res.send(data);
		})
		.error(function(err) {
			next(err);
		});
})
.post('/', upload.single('inputImage'), function (req, res) {
	var post = createPost(req);
	req.db.get('webCollection').insert({
		title: post.title,
		url: post.url,
		date: post.date,
		description: post.description,
		image: post.image,
		categories: post.categories,
		type: 'web'
	}, function(err, doc) {
		if (err)
			next(err);
		else
			res.send(doc);
	})
})
.delete('/:id', function (req, res) {
	req.db.get('webCollection').remove({'_id':req.params.id}, function(err) {
		next(err);
	})
})
.put('/:id', upload.single('inputImage'), function (req, res) {
	var post = createPost(req);
	if (req.body.oldImage != null)
		post.image = req.body.oldImage;
	req.db.get('webCollection').update({'_id':req.params.id}, {
		$set:{
			title: post.title,
			url: post.url,
			date: post.date,
			description: post.description,
			image: post.image,
			categories: post.categories,
			type: 'web'
		}
	}, function(err, doc) {
		if (err)
			next(err)
		else
			res.send(doc);
	});
});

module.exports = router;