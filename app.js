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


// Database initialization

// Passport settings
//require('./server/config/passport')(app, passport);

// Express settings
//require('./server/config/express')(app, express, passport);

// Socket.IO
//require('./server/socket')(io);


app.run = function() {
	require('./core/express').run(app);
	require('./core/http').run(app);

	app.servers.express.getServer().use(routes.register(app));
}

module.exports = app;
