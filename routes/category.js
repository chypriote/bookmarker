const express = require('express');
const router = express.Router();

// List of categories
router.get('/', async (req, res) => {
	const [posts, games] = await Promise.all([
			req.db.get('postCategories').find({}),
			req.db.get('gameCategories').find({})
		])
	
	return res.render('category', {
		"postCategories": posts,
		"gameCategories": games,
		"title": "Liste des jeux disponibles"
	})
});

router.get('/add', async (req, res) => {
	const docs = await req.db.get('postCategories').find({}, {})
	
	return res.render('category', {
		"categoryList": docs,
		"title": "Ajouter une catégorie"
	});
});

//delete category
router.delete('/:id', async (req, res) => {
	try {
		await req.db.get('postCategories').remove({'_id':req.params.id})
	} catch (err) {
		return res.send((err === null) ? {msg:''} : {msg:'error: '+err})
	}
});

//add category
router.post('/', async (req, res) => {
	try {
		await req.db.get('postCategories').insert({ "name": req.body.postCategory.toLowerCase() })
		return res.redirect('/category');
	} catch (err) {
		return req.send("There was a problem adding the category to the database");
	}
});


module.exports = router;