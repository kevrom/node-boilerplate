var logger         = require('morgan');
var path           = require('path');
var responseTime   = require('response-time');
var methodOverride = require('method-override');
var multer         = require('multer');
var compression    = require('compression');
var favicon        = require('static-favicon');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var errorHandler   = require('errorhandler');
var env            = process.env.NODE_ENV || 'development';
var views_helpers  = require('../helper/views-helper');
var pkg            = require('../../package.json');
var flash          = require('express-flash');
var routes         = require('../routes');
var _              = require('lodash');

module.exports = function (app, express, passport) {

	var allowCrossDomain = function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Credentials', true);
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	};

	// settings
	app
		.set('env', env)
		.set('port', app.config.server.port || 3000)
		.set('views', path.join(__dirname, '../../app/views'))
		.set('view engine', 'jade');

	app
		.enable('trust proxy');

	app
		.disable('x-powered-by');

	// Express middleware
	app
		.use(favicon(path.join(app.config.root, 'public/favicon.png')))
		.use(bodyParser())
		.use(multer())
		.use(methodOverride())
		.use(allowCrossDomain);

	app.use(cookieParser('whoareyouandwhatareyoudoinghere'));
	app.use(session({
		secret: pkg.name,
		store: new MongoStore({
			url: app.config.database.url,
			collection : 'sessions',
			auto_reconnect: true
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session({
		maxAge: new Date(Date.now() + 3600000)
	}));

	app.use(express.static(path.join(app.config.root, 'public')));
	app.use(function (req, res, next) {
		res.locals.pkg = pkg;
		res.locals.NODE_ENV = env;

		if(_.isObject(req.user)) {
			res.locals.User = req.user;
		}

		next();
	});

	app.use(views_helpers(pkg.name));
	app.use(flash());

	/** ROUTES Apps */
	app.use(routes);

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(logger('dev'));
		app.use(errorHandler());
		app.use(responseTime());
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('500', {
				message: err.message,
				error: err
			});
		});
	} else {
		app.use(logger());
		app.use(compression({
			filter: function (req, res) {
				return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
			},
			level: 9
		}));
	}

	// error handlers

	// catch 404 and forwarding to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		res.status(404).render('404', {
			url: req.protocol + '://' + req.headers.host + req.originalUrl,
			error: 'Page not found !!!'
		});
	});

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('500', {
			message: err.message,
			error: {}
		});
	});
};