'use strict';

var LocalStrategy = require('passport-local').Strategy;

var _app = null;

function _configure() {
	var passport = _app.passport;
	var User = _app.models.User;

	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
	},
	function(email, password, done) {
		User
			.find({ where:  { email: email }})
			.success(function(user) {
				user.authenticate(password, function(err, res) {
					if (err) {
						console.error(err);
						return done(err, null);
					}
					if (!res) {
						console.log('Invalid password');
						return done(null, false, { message: 'Password is incorrect.' });
					}
					return done(null, user);
				});
			})
			.error(function(err) {
				console.error(err);
				return done(err);
			});
	}));
}

function init(app) {
	_app = app;
	_configure();
}

module.exports = init;
