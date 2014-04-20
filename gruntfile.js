'use strict';

var config = require('./config/config');

module.exports = function(grunt) {
	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverViews: {
				files: ['app/views/**'],
				options: {
					livereload: true,
				}
			},
			serverJS: {
				files: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
				tasks: ['jshint'],
				options: {
					livereload: true,
				}
			},
			clientViews: {
				files: ['public/modules/**/views/*.html'],
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: ['public/js/**/*.js', 'public/modules/**/*.js'],
				tasks: ['jshint'],
				options: {
					livereload: true,
				}
			},
			clientCSS: {
				files: ['public/**/css/*.css'],
				tasks: ['csslint'],
				options: {
					livereload: true,
				}
			}
		},
		jshint: {
			all: {
				src: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/**/*.js', 'public/modules/**/*.js'],
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: ['public/modules/**/css/*.css']
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': config.assets.js
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': config.assets.css
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug']
				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			}
		},
		mochaTest: {
			src: ['app/tests/**/*.js'],
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		}
	});

	//Load NPM tasks 
	require('load-grunt-tasks')(grunt);

	//Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	//Default task(s).
	grunt.registerTask('default', ['jshint', 'csslint', 'concurrent']);

	//Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	//Build task(s).
	grunt.registerTask('build', ['jshint', 'csslint', 'uglify', 'cssmin']);

	//Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};