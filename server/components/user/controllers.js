'use strict';

var path           = require('path');
var UserController = {};

UserController.index = function(req, res) {
	res.cRender('user/index', {});
};

UserController.login = {
	get: function(req, res) {
		res.cRender('user/login', {
			title: 'Login'
		});
	},
	post: function(req, res) {
		// req.session.returnTo is set in Auth middleware
		var redirect = req.session.returnTo || '/';
		delete req.session.returnTo;
		res.redirect(redirect);
	}
};

UserController.register = {
	get: function(req, res) {
		res.cRender('user/register', {});
	},
	post: function(req, res) {
		console.log('registerpost');
	}
};

UserController.logout = function(req, res) {
	req.logout();
	req.flash('success', 'Successfully logged out.');
	res.redirect('/');
};

module.exports = UserController;
