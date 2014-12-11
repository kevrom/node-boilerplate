'use strict';

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var _app = null;

function _configure() {
	var User         = _app.models.User;
	var UserProvider = _app.models.UserProvider;
	var passport     = _app.passport;
	var googleConfig = {
		clientID    : _app.config.get('auth.google.clientID'),
		clientSecret: _app.config.get('auth.google.clientSecret'),
		callbackURL : _app.config.get('auth.google.callbackURL')
	};

	passport.use(new GoogleStrategy(googleConfig, function(req, accessToken, refreshToken, profile, done) {
		console.log(profile);

		// Find or create the UserProvider associated with the profile submitted
		UserProvider
			.findOrCreate({
				providerId: profile.id
			}, {
				name: profile.displayName,
				provider: 'google',
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
