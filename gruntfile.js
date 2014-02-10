'use strict';

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
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-env');

	//Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	//Default task(s).
	grunt.registerTask('default', ['jshint', 'concurrent']);

	//Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};