'use strict';

module.exports = {
	client: {
		lib: {
			css: [
				'node_modules/bootstrap/dist/css/bootstrap.css',
				'node_modules/bootstrap/dist/css/bootstrap-theme.css'
			],
			js: [
				'node_modules/angular/angular.js',
				'node_modules/angular-resource/angular-resource.js',
				'node_modules/angular-animate/angular-animate.js',
				'node_modules/angular-ui-router/release/angular-ui-router.js',
				'node_modules/angular-ui-utils/ui-utils.js',
				'node_modules/angular-bootstrap/dist/ui-bootstrap-tpls.js',
				'node_modules/angular-file-upload/dist/angular-file-upload.js'
			],
			tests: ['node_modules/angular-mocks/angular-mocks.js']
		},
		css: [
			'modules/*/client/css/*.css'
		],
		less: [
			'modules/*/client/less/*.less'
		],
		sass: [
			'modules/*/client/scss/*.scss'
		],
		js: [
			'modules/core/client/app/config.js',
			'modules/core/client/app/init.js',
			'modules/*/client/*.js',
			'modules/*/client/**/*.js'
		],
		views: ['modules/*/client/views/**/*.html']
	},
	server: {
		allJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
		models: 'modules/*/server/models/**/*.js',
		routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
		sockets: 'modules/*/server/sockets/**/*.js',
		config: 'modules/*/server/config/*.js',
		policies: 'modules/*/server/policies/*.js',
		views: 'modules/*/server/views/*.html'
	}
};
