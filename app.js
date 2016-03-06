var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var multer = require('multer'),
		mongo = require('mongodb'),
		monk = require('monk'),
		dbDev = monk('127.0.0.1:27017/bookmarker'),
		dbProd = monk('127.0.0.1:27017/production');

db = (process.env.NODE_ENV == 'production') ? dbProd : dbDev;

var app = express();

app.locals.moment = require('moment');
app.locals.ucfirst = function(value){return value.charAt(0).toUpperCase() + value.slice(1);};

// view engine setup
app.set('views', path.join(__dirname, 'site/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'site/assets/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'site/assets')));

app.use(function(req, res, next) {
	req.db = db;
	next();
});

app.use('/api', require('./api/index.js'));
app.use('/', require('./site/routes/index.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// ----------------
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
