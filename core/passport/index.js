'use strict';

module.exports = function(app) {

	/*
	* Sign in Locally
	*/
	if (app.config.get('auth.local.enabled')) {
		require('./strategies/local.js')(app);
	}

	/*
	* Sign in with Twitter.
	*/
	if (app.config.get('auth.twitter.enabled')) {
		require('./strategies/twitter.js')(app);
	}

	/*
	* Sign in with Facebook.
	*/
	if (app.config.facebookAuth) {
		require('./strategies/facebook.js')(app);
	}

};
