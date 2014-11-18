'use strict';

var Router         = require('express').Router();
var path           = require('path');
var UserController = require('./controllers.js');

var _app = null;

function _configure() {
	var Auth     = _app.middleware.Auth;
	var passport = _app.passport;

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
			.get('/auth/twitter', passport.authenticate('twitter'))
			.get('/auth/twitter/callback',
				passport.authenticate('twitter',
				{ failureRedirect: '/login' }),
				function(req, res) {
					res.redirect(req.session.returnTo || '/');
				});

	}

	// Facebook Authentication
	if (_app.config.get('auth.facebook.enabled')) {
		Router
			.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))
			.get('/auth/facebook/callback',
				passport.authenticate('facebook',
				{ failureRedirect: '/login' }),
				function(req, res) {
					res.redirect(req.session.returnTo || '/');
				});

	}

	// Google Authentication
	if (_app.config.get('auth.google.enabled')) {
		Router
			.get('/auth/google', passport.authenticate('google', { scope: ['email']}))
			.get('/auth/google/callback',
				passport.authenticate('google',
				{ failureRedirect: '/login' }),
				function(req, res) {
					res.redirect(req.session.returnTo || '/');
				});
	}

}

function init(app) {
	_app = app;
	_configure();
	return Router;
}

module.exports = init;
