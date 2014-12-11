'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;

var _app = null;

function _configure() {
	var User          = _app.models.User;
	var UserProvider  = _app.models.UserProvider;
	var passport      = _app.passport;
	var twitterConfig = {
		consumerKey   : _app.config.get('auth.twitter.consumerKey'),
		consumerSecret: _app.config.get('auth.twitter.consumerSecret'),
		callbackURL   : _app.config.get('auth.twitter.callbackURL')
	};

	passport.use(new TwitterStrategy(twitterConfig, function(req, accessToken, tokenSecret, profile, done) {
		console.log(profile);

		// Find or create the UserProvider associated with the profile submitted
		UserProvider
			.findOrCreate({
				providerId: profile.id
			}, {
				name: profile.displayName,
				provider: 'twitter',
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


		//if (req.user) {
			//User.findOne({ $or: [
					//{'twitter.id': profile.id },
					//{ username: profile.username },
					//{ email: profile.username + "@twitter.com" }] },
			//function(err, existingUser) {
				//if (existingUser) {
					//req.flash('errors', { msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
					//done(err);
				//} else {
					//User.findById(req.user.id, function(err, user) {
						//user.email         = profile.username + "@twitter.com";
						//user.provider      = 'twitter';
						//user.twitter       = profile._json;
						//user.photo_profile = profile._json.profile_image_url;
						//user.username      = profile.username;
						//user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });

						//user.save(function(err) {
							//req.flash('info', { msg: 'Twitter account has been linked.' });
							//done(err, user);
						//});
					//});
				//}
			//});

		//} else {
			//User.findOne({ 'twitter.id_str': profile.id }, function(err, existingUser) {
				//if (existingUser) {
					//return done(null, existingUser);
				//}
				//var user = new User();
				//// Twitter will not provide an email address.  Period.
				//// But a person’s twitter username is guaranteed to be unique
				//// so we can "fake" a twitter email address as follows:

				//user.email         = profile.username + "@twitter.com";
				//user.provider      = 'twitter';
				//user.twitter       = profile._json;
				//user.photo_profile = profile._json.profile_image_url;
				//user.username      = profile.username;
				//user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });

				//user.save(function(err) {
					//done(err, user);
				//});
			//});
		//}
	}));
}

function init(app) {
	_app = app;
	_configure();
}

module.exports = init;
