'use strict';

module.exports = function(app) {

	// Sign in Locally
	if (app.config.get('auth.local.enabled')) {
		require('./strategies/local')(app);
	}

	// Sign in with Twitter
	if (app.config.get('auth.twitter.enabled')) {
		require('./strategies/twitter')(app);
	}

	// Sign in with Facebook
	if (app.config.get('auth.facebook.enabled')) {
		require('./strategies/facebook')(app);
	}

	// Sign in with Google
	if (app.config.get('auth.google.enabled')) {
		require('./strategies/google')(app);
	}

};
