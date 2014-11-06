'use strict';

var path = require('path');
var Router = require('express').Router();

var indexController = require('./controllers.js');

var _app = null;

function _configure() {

	Router.get('/', indexController.index);

	Router.use(require('../server/components/user/routes')(_app));

}

function init(app) {
	_app = app;
	_configure();
	return Router;
}

module.exports = init;
