'use strict';

var cfenv = require('cfenv'),
    appEnv = cfenv.getAppEnv(),
    cfMongoUrl = appEnv.getService('mean-mongo') ? 
    appEnv.getService('mean-mongo').credentials.uri : undefined;

var getCred = function(serviceName, credProp) {
	return appEnv.getService(serviceName) ? 
    appEnv.getService(serviceName).credentials[credProp] : undefined;	
};

module.exports = {
	port:  appEnv.port,
	db: cfMongoUrl,
	facebook: {
		clientID: getCred('mean-facebook', 'id') || 'APP_ID',
		clientSecret: getCred('mean-facebook', 'secret') || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: getCred('mean-twitter', 'key') || 'CONSUMER_KEY',
		clientSecret: getCred('mean-twitter', 'secret') || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: getCred('mean-google', 'id') || 'APP_ID',
		clientSecret: getCred('mean-google', 'secret') || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: getCred('mean-linkedin', 'id') || 'APP_ID',
		clientSecret: getCred('mean-linkedin', 'secret') || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: getCred('mean-github', 'id') || 'APP_ID',
		clientSecret: getCred('mean-github', 'secret') || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: getCred('mean-mail', 'from') || 'MAILER_FROM',
		options: {
			service: getCred('mean-mail', 'service') || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: getCred('mean-mail', 'username') || 'MAILER_EMAIL_ID',
				pass: getCred('mean-mail', 'password') || 'MAILER_PASSWORD'
			}
		}
	}
};