'use strict';

var Router         = require('express').Router();
var path           = require('path');
var UserController = require('./controllers.js');

var _app = null;

function _configure() {
	var Auth = _app.middleware.Auth;

	// Local Authentication
	if (_app.config.get('auth.local.enabled')) {
		Router
			.get('/login', Auth.requiresAnon, UserController.login.get)
			.post('/login', Auth.authenticate, UserController.login.post)
			.get('/register', UserController.register.get)
			.get('/logout', UserController.logout);
			//.get('/forgot-password', UserController.forgotPassword.get)
			//.post('/forgot-password',Auth.requiresAnon, UserController.forgotPassword.post)
			//.get('/reset/:token', Auth.requiresAnon, UserController.resetPassword.get)
			//.post('/reset/:token', Auth.requiresAnon, UserController.resetPassword.post)
			//.get('/me', Auth.requiresLogin, UserController.show)
			//.get('/u/:username', UserController.user_profile);
	}

	// Twitter Authentication
	if (_app.config.get('auth.twitter.enabled')) {
		Router
			.get('/auth/twitter', _app.passport.authenticate('twitter'))
			.get('/auth/twitter/callback',
				_app.passport.authenticate('twitter',
				{ failureRedirect: '/login' }),
				function(req, res) {
					res.redirect(req.session.returnTo || '/');
				});

	}

	// Facebook Authentication
	if (_app.config.get('auth.facebook.enabled')) {
		Router
			.get('/auth/facebook', _app.passport.authenticate('facebook', { scope: ['email', 'user_location'] }))
			.get('/auth/facebook/callback',
				_app.passport.authenticate('facebook',
				{ failureRedirect: '/login' }),
				function(req, res) {
					res.redirect(req.session.returnTo || '/');
				});

	}

	// Google Authentication
	if (_app.config.get('auth.google.enabled')) {
		console.log('blah');
	}

}

function init(app) {
	_app = app;
	_configure();
	return Router;
}

module.exports = init;
