var express = require('express');
var express = require('express');
var router = express.Router();

router.use('/', require('./v1/index'));
router.use('/admin', require('./v1/admin'));
router.use('/web', require('./v1/web'));
router.use('/games', require('./v1/games'));
router.use('/plugins', require('./v1/plugins'));

module.exports = router;
