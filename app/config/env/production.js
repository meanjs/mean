'use strict';

var server = process.env.SERVER_BASE || 'http://localhost:3000';
var logOutputFile = 'app.log';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/mean',
	log4js: {
		logFile: logOutputFile,
		config: {
			replaceConsole: true,
			appenders: [
				//{ type: 'console' },
				{ type: 'file', filename: logOutputFile }
			]
		}
	},
	assets: {
		lib: {
			css: [
				'public/lib/bower_components/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
			],
			js: [
				'public/lib/bower_components/angular/angular.min.js',
				'public/lib/bower_components/angular-resource/angular-resource.min.js',
				'public/lib/bower_components/angular-animate/angular-animate.min.js',
				'public/lib/bower_components/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/bower_components/angular-ui-utils/ui-utils.min.js',
				'public/lib/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/bower_components/angular-logex/dist/log-ex-unobtrusive.min.js',
				'public/lib/bower_components/angular-utilz/dist/angular-utilz.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: server + 'auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: server + '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: server + '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: server + '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: server + '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
