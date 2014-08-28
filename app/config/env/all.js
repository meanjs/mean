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
		lib: {
			css: [
				'public/lib/bower_components/bootstrap/dist/css/bootstrap.css',
				'public/lib/bower_components/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				'public/lib/bower_components/angular/angular.js',
				'public/lib/bower_components/angular-resource/angular-resource.js',
				'public/lib/bower_components/angular-animate/angular-animate.js',
				'public/lib/bower_components/angular-ui-router/release/angular-ui-router.js',
				'public/lib/bower_components/angular-ui-utils/ui-utils.js',
				'public/lib/bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			//'public/modules/*/js/*/*.js',
			'public/modules/*/js/**/*.js'
		],
		tests: [
			'public/lib/bower_components/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/unit/**/*.js'
		]
	}
};
