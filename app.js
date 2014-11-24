'use strict';

var path     = require('path');
var config   = require('./core/config');
var passport = require('passport');

/*
 * The app object is the core of this application.
 * @param {String} [app.root] The root directory of this application
 * @param {Object} [app.config] Access the application's configuration via [node-convict](https://github.com/mozilla/node-convict)
 * @param {Object} [app.servers] Access the servers currently running e.g. http, express, socketio
 * @param {Object} [app.middleware] Access the various middleware available
 * @param {Object} [app.models] Access the models loaded automatically from component models directories
 * @param {Object} [app.utils] Access to various helpful utilities
 * @param {Object} [app.passport] Access the base passport object
 * @param {Object} [app.sequelize] Access the sequelize database object
 * @param {Object} [app.Sequelize] Access the base sequelize objects
 */
var app = {
	root: __dirname,
	config: config,
	servers: {},
	middleware: {},
	models: {},
	utils: {},
	passport: passport,
	sequelize: null,
	Sequelize: null
};

app.middleware.Auth = require('./core/middleware/auth');
app.utils.Emailer   = require('./core/utils/emailer');

app.run = function() {

	// Initialize Express middleware
	require('./core/express')(app);

	// Initialize HTTP server
	require('./core/http')(app);

	// Initialize Sequelize/Database
	require('./core/database')(app);

	// Initialize Passport
	require('./core/passport')(app);

};

module.exports = app;
