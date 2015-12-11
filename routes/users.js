var express = require('express');
var router = express.Router();

// List of users
router.get('/', function(req, res) {
	var collection = req.db.get('usercollection');
	collection.find({}, {}, function(e, docs){
		res.render('users/list', {
			"userlist": docs,
			"title": "User List"
		});
	})
});
router.get('/add', function(req, res) {
  res.render('users/new', { title: 'ChypRiotE' });
});

//user by id
router.get('/:id', function(req, res) {
	var collection = req.db.get('usercollection');
	collection.find({'_id':req.params.id}, function(err) {
		res.send((err === null ? {msg:''} : {msg:'error: ' + err}));
	});
});
//user by name
router.get('/:name', function(req, res) {
	var collection = req.db.get('usercollection');
	collection.find({'name':req.params.name}, function(err) {
		res.send((err === null ? {msg:''} : {msg:'error: ' + err}));
	});
});

//delete user
router.delete('/:id', function(req, res) {
	var collection = req.db.get('usercollection');
	collection.remove({'_id':req.params.id}, function(err) {
		res.send((err === null) ? {msg:''} : {msg:'error: '+err});
	});
});

//add user
router.post('/', function(req, res) {
	var userName = req.body.username,
			userPass = req.body.userpassword;
	var collection = req.db.get('usercollection');

	collection.insert({
		"name":userName,
		"password":userPass
	}, function(err, doc){
		if (err) {
			req.send("There was a problem adding the information to the database");
		} else {
			res.redirect('/users');
		}
	});
});


module.exports = router;
