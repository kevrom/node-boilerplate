'use strict';

module.exports = function(app) {
	var passport = app.passport;
	var User     = app.models.User;
	var conf     = app.config;
	var lAuth    = conf.get('auth.local.enabled'),
		fAuth    = conf.get('auth.facebook.enabled'),
		tAuth    = conf.get('auth.twitter.enabled'),
		gAuth    = conf.get('auth.twitter.enabled');

	if (lAuth || tAuth || fAuth || gAuth) {
		passport.serializeUser(function(user, done) {
			done(null, user.id);
		});

		passport.deserializeUser(function(id, done) {
			User
				.find({ where: { id: id }})
				.success(function(user) {
					done(null, user);
				})
				.error(function(err) {
					console.log('Error deserializing user');
					done(err, null);
				});
		});
	}


	// Sign in Locally
	if (lAuth) {
		require('./strategies/local')(app);
	}

	// Sign in with Twitter
	if (tAuth) {
		require('./strategies/twitter')(app);
	}

	// Sign in with Facebook
	if (fAuth) {
		require('./strategies/facebook')(app);
	}

	// Sign in with Google
	if (gAuth) {
		require('./strategies/google')(app);
	}

};
