'use strict';

// Module dependencies
var path     = require('path');
var config   = require('./core/config');
var passport = require('passport');

var app = {
	root: __dirname,
	config: config,
	servers: {},
	middleware: {},
	passport: passport
};

app.middleware.Auth = require('./core/middleware/auth');

// Passport settings
//require('./server/config/passport')(app, passport);

// Socket.IO
//require('./server/socket')(io);


app.run = function() {

	// Initialize Express middleware
	require('./core/express').init(app);

	// Initialize HTTP server
	require('./core/http').init(app);

	// Initialize Sequelize/Database
	//require('./core/database').init(app);
};

module.exports = app;
