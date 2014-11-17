'use strict';

var express        = require('express');
var logger         = require('morgan');
var path           = require('path');
var responseTime   = require('response-time');
var methodOverride = require('method-override');
var multer         = require('multer');
var compression    = require('compression');
var favicon        = require('serve-favicon');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var RedisStore     = require('connect-redis')(session);
var errorHandler   = require('errorhandler');
var flash          = require('express-flash');
var _              = require('lodash');

var _app = null;
var _server = null;

var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Credentials', true);
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
};

function _configure() {
	var env   = _app.config.get('server.env');
	var root  = _app.root;
	var paths = _app.config.get('paths');

	_server
		.set('views', path.join(_app.root, paths.server, 'templates'))
		.set('view engine', 'jade')
		.enable('trust proxy')
		.disable('x-powered-by');

	// Express middleware
	_server
		.use(favicon(path.join(_app.root, paths.public, 'favicon.png')))
		.use(bodyParser.json())
		.use(bodyParser.urlencoded({
			extended: true
		}))
		// .use(multer())
		.use(methodOverride());

	if (_app.config.get('server.allowCrossDomain')) {
		_server.use(allowCrossDomain);
	}

	_server.use(cookieParser(_app.config.get('app.secret')));
	_server.use(session({
		secret: _app.config.get('app.secret'),
		saveUninitialized: true,
		resave: true,
		store: new RedisStore()
	}));

	_server.use(_app.passport.initialize());
	_server.use(_app.passport.session({
		maxAge: new Date(Date.now() + 86400000)
	}));

	_server.use(express.static(path.join(_app.root, paths.dist)));
	_server.use(function (req, res, next) {
		res.locals.NODE_ENV        = env;
		res.locals.auth            = {};
		res.locals.auth.local      = _app.config.get('auth.local.enabled');
		res.locals.auth.twitter    = _app.config.get('auth.twitter.enabled');
		res.locals.auth.facebook   = _app.config.get('auth.facebook.enabled');
		res.locals.auth.google     = _app.config.get('auth.google.enabled');
		res.locals.app             = {};
		res.locals.app.name        = _app.config.get('app.name');
		res.locals.app.keywords    = _app.config.get('app.keywords');
		res.locals.app.description = _app.config.get('app.description');

		if(_.isObject(req.user)) {
			res.locals.User = req.user;
		}
		next();
	});

	/*
	 * res.cRender() searches for the template in the component templates directory
	 * it requires the syntax res.cRender('component/view', locals, cb);
	 */
	_server.use(function(req, res, next) {
		res.cRender = function(view, locals, cb) {
			var viewArr = view.split('/');
			var tpl = path.join(_app.root, paths.server, 'components', viewArr[0], 'templates', viewArr[1]); 
			return res.render(tpl, locals, cb);
		};
		next();
	});

	_server.use(flash());

	_server.use(require(path.join(_app.root, paths.server, 'routes'))(_app));

	// development error handler
	// will print stacktrace
	if (env === 'development') {
		_server
			.use(logger('dev'))
			.use(errorHandler())
			.use(responseTime());

		_server.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('500', {
				message: err.message,
				error: err
			});
		});
	} else {
		_server.use(logger());
		_server.use(compression({
			filter: function (req, res) {
				return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
			},
			level: 9
		}));

		// error handlers

		// 404
		_server.use(function(req, res, next) {
			var err = new Error('Not Found');
			res.status(404).render('404', {
				url: req.protocol + '://' + req.headers.host + req.originalUrl,
				error: 'Page not found!'
			});
		});

		// 500
		_server.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('500', {
				message: err.message,
				error: {}
			});
		});

	}



}

function getServer() {
	return _server;
}

function init(app) {
	_app = app;
	_app.servers.express = exports;
	_server = express();
	_configure();
}

// Public API
module.exports.getServer = getServer;
module.exports           = init;
