'use strict';

var convict  = require('convict');
var path     = require('path');
var chalk    = require('chalk');
var pkg      = require('../../package.json');

var conf = convict({
	app: {
		name: {
			doc: "Name of the application",
			default: pkg.name,
			env: "APP_NAME"
		},
		description: {
			doc: "Description of application",
			default: pkg.description
		},
		keywords: {
			doc: "Comma-delimited list of keywords for application",
			default: pkg.keywords.join(' ')
		},
		author: {
			doc: "Author of the application",
			default: pkg.author
		},
		secret: {
			doc: "Secret for sessions",
			default: "",
			env: "APP_SECRET"
		}
	},
	paths: {
		public: {
			doc: "Path for public-accessible files",
			default: "public"
		},
		server: {
			doc: "Path for server files",
			default: "server"
		},
		upload: {
			doc: "Path for uploads",
			default: "media"
		},
		test: {
			doc: "Path for tests",
			default: "test"
		},
		temp: {
			doc: "Path for temporary files",
			default: ".tmp"
		},
		log: {
			doc: "Path for log files",
			default: "log"
		},
		dist: {
			doc: "Path for built distributions",
			default: "dist"
		}
	},
	server: {
		env: {
			doc: "The applicaton environment.",
			format: ["production", "development", "test"],
			default: "development",
			env: "NODE_ENV",
			arg: "node-env"
		},
		ip: {
			doc: "The IP address to bind.",
			format: "ipaddress",
			default: "127.0.0.1",
			env: "IP_ADDRESS",
		},
		port: {
			doc: "The port to bind.",
			format: "port",
			default: 8080,
			env: "PORT"
		},
		allowCrossDomain: {
			doc: "Enable CORS",
			format: Boolean,
			default: false
		}
	},
	email: {
		name: {
			doc: "Name to put on emails",
			default: "",
			env: "EMAIL_NAME"
		},
		address: {
			doc: "Email address to send email from",
			format: "email",
			default: "",
			env: "EMAIL_ADDRESS"
		},
		service: {
			doc: "Email service to use e.g. gmail, mailgun",
			default: "gmail",
			env: "EMAIL_SERVICE"
		},
		username: {
			doc: "Username for email account",
			default: "",
			env: "EMAIL_USERNAME"
		},
		password: {
			doc: "Password for email account",
			default: "",
			env: "EMAIL_PASSWORD"
		}
	},
	database: {
		engine: {
			doc: "Database engine to use for application",
			default: "postgres",
			format: ['postgres'],
			env: "DB_ENGINE"
		},
		table: {
			doc: "Name of database table",
			default: pkg.name,
			env: "DB_TABLE"
		},
		username: {
			doc: "Username for database",
			default: "",
			env: "DB_USERNAME"
		},
		password: {
			doc: "Password for database",
			default: "",
			env: "DB_PASSWORD"
		}
	},
	auth: {
		local: {
			enabled: {
				doc: "Enable local auth",
				format: Boolean,
				default: false
			}
		},
		twitter: {
			enabled: {
				doc: "Enable Twitter auth",
				format: Boolean,
				default: false
			},
			consumerKey: {
				doc: "Consumer key for Twitter",
				default: "",
				env: "TWITTER_KEY"
			},
			consumerSecret: {
				doc: "Consumer secret for Twitter",
				default: "",
				env: "TWITTER_SECRET"
			},
			callbackURL: {
				doc: "URL to callback for Twitter",
				default: "/auth/twitter/callback"
			},
			passReqToCallback: {
				doc: "Pass request context to Twitter callback",
				format: Boolean,
				default: true
			}
		},
		facebook: {
			enabled: {
				doc: "Enable Facebook auth",
				format: Boolean,
				default: false
			},
			clientID: {
				doc: "Client ID for Facebook",
				default: "",
				env: "FACEBOOK_CLIENT"
			},
			clientSecret: {
				doc: "Client Secret for Facebook",
				default: "",
				env: "FACEBOOK_SECRET"
			},
			callbackURL: {
				doc: "URL to callback for Facebook",
				default: "/auth/facebook/callback"
			},
			passReqToCallback: {
				doc: "Pass request context to Facebook callback",
				format: Boolean,
				default: true
			}
		},
		google: {
			enabled: {
				doc: "Enable Google auth",
				format: Boolean,
				default: false
			},
			clientID: {
				doc: "Client ID for Google",
				default: "",
				env: "GOOGLE_ID"
			},
			clientSecret: {
				doc: "Client Secret for Google",
				default: "",
				env: "GOOGLE_SECRET"
			},
			callbackURL: {
				doc: "URL to callback for Google",
				default: "/auth/google/callback"
			},
			passReqToCallback: {
				doc: "Pass request context to Google callback",
				format: Boolean,
				default: true
			}
		}
	}
});

var settingsFile = 'settings.' + conf.get('server.env') + '.json';
var settingsPath = path.resolve(path.dirname(module.filename), '../../' + settingsFile);
try {
	conf.loadFile(settingsPath);
} catch (e) {
	console.log(chalk.red(e));
	process.exit(0);
}

try {
	conf.validate();
} catch (e) {
	console.log(chalk.red('Configuration %s'), e);
	process.exit(0);
}

module.exports = conf;
