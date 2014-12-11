'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;

var _app = null;

function _configure() {
	var User           = _app.models.User;
	var UserProvider   = _app.models.UserProvider;
	var passport       = _app.passport;
	var facebookConfig = {
		clientID    : _app.config.get('auth.facebook.clientID'),
		clientSecret: _app.config.get('auth.facebook.clientSecret'),
		callbackURL : _app.config.get('auth.facebook.callbackURL'),
		enableProof : false
	};

	passport.use(new FacebookStrategy(facebookConfig, function(req, accessToken, refreshToken, profile, done) {
		//console.log(profile);
		//if (req.user) { console.log(req.user); }

		// Find or create the UserProvider associated with the profile submitted
		UserProvider
			.findOrCreate({
				providerId: profile.id
			}, {
				name: profile.displayName,
				provider: 'facebook',
				email: profile.emails[0].value,
				gender: profile.gender,
				profileUrl: profile.profileUrl
			})
			.success(function(userProvider, userProviderCreated) {
				// Find or create a User based on the email submitted
				User
					.findOrCreate({
						email: profile.emails[0].value,
					}, {
						name: profile.displayName,
						isActive: true,
						verified: true
					})
					.success(function(user, userCreated) {
						// If the user or userProvider is newly created, link them
						if (userProviderCreated || userCreated) {
							userProvider.setUser(user);
						}
						done(null, user);
					})
					.error(function(err) {
						done(err);
					});
			})
			.error(function(err) {
				done(err);
			});

	}));
}

function init(app) {
	_app = app;
	_configure();
}

module.exports = init;
