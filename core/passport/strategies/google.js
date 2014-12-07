'use strict';

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var _app = null;

function _configure() {
	var User         = _app.models.User;
	var passport     = _app.passport;
	var googleConfig = {
		clientID    : _app.config.get('auth.google.clientID'),
		clientSecret: _app.config.get('auth.google.clientSecret'),
		callbackURL : _app.config.get('auth.google.callbackURL')
	};

	passport.use(new GoogleStrategy(googleConfig, function(req, accessToken, refreshToken, profile, done) {
		console.log(profile);
		//if (req.user) {
			//User.findOne({ $or: [
					//{ 'facebook.id' : profile.id },
					//{ username : profile.username},
					//{ email: profile.email }] },
			//function(err, existingUser) {
				//if (existingUser) {
					//req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
					//done(err);
				//} else {
					//User.findById(req.user.id, function(err, user) {
						//[> jshint ignore:start <]
						//user.facebook      = profile;
						//user.username      = profile.username;
						//user.provider      = 'facebook',
						//user.facebook      = profile._json;
						//user.firstname     = user.firstname || profile.first_name;
						//user.lastname      = user.lastname || profile.last_name;
						//user.photo_profile = user.photo_profile || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
						//[> jshint ignore:end <]

						//user.tokens.push({ kind: 'facebook', accessToken: accessToken });

						//user.save(function(err) {
							//req.flash('info', { msg: 'Facebook account has been linked.' });
							//done(err, user);
						//});
					//});
				//}
			//});
		//} else {
			//User.findOne({ 'facebook.id' : profile.id }, function(err, existingUser) {

				//if (existingUser) {
					//return done(null, existingUser);
				//}

				//User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
					//if (existingEmailUser) {
						//req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
						//done(err);
					//} else {
						//var user = new User();
						//[> jshint ignore:start <]
						//user.email         = profile._json.email;
						//user.facebook      = profile;
						//user.username      = profile.username;
						//user.provider      = 'facebook',
						//user.facebook      = profile._json;
						//user.firstname     = user.firstname || profile.first_name;
						//user.lastname      = user.lastname || profile.last_name;
						//user.photo_profile = user.photo_profile || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
						//[> jshint ignore:end <]

						//user.tokens.push({ kind: 'facebook', accessToken: accessToken });

						//user.save(function(err) {
							//done(err, user);
						//});
					//}
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
