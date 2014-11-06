'use strict';

var path           = require('path');
var UserController = {};
function t(tpl) { return path.join(__dirname, 'templates', tpl); }  // helper function to target templates for this component

UserController.index = function(req, res) {
	res.render(t('index'), {});
};

UserController.login = {
	get: function(req, res) {
		res.render(t('login'), {});
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
		res.render(t('register'), {});
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
