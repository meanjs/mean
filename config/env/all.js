'use strict';

module.exports = {
	app: {
		title: 'MEAN.JS',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		css: [
			'public/lib/bootstrap/dist/css/bootstrap.css',
			'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			'public/modules/**/css/*.css'
		],
		lib: [
			'public/lib/angular/angular.js',
			'public/lib/angular-resource/angular-resource.js',
			'public/lib/angular-animate/angular-animate.js',
			'public/lib/angular-ui-router/release/angular-ui-router.js',
			'public/lib/angular-ui-utils/ui-utils.js',
			'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
