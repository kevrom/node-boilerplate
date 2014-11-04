'use strict';

// Module dependencies
var path   = require('path');
var config = require('./core/config');
var routes = require('./server/routes');


var app = {
	root: __dirname,
	config: config,
	servers: {}
};


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
	require('./core/database').init(app);

	app.servers.express.getServer().use(routes.register(app));
};

module.exports = app;
