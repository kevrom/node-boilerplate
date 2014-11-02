'use strict';

var path = require('path');
var Router = require('express').Router();
//var Auth = require(config.root + '/server/middleware/auth');

function register(app) {
	var indexController = require(path.join(app.root, app.config.get('paths.server'), 'controllers'));

	Router.get('/', indexController.index);

	return Router;
}


// User routes
//Route.use(require('./user'));


module.exports.register = register;
