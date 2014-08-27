'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		serverJS: ['gruntfile.js', 'server.js', 'app/**/*.js'],
		nodeFiles: ['server.js', 'app/**/*.js', '!app/tests/**/*.js',],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/*.js', 'public/modules/*/js/**/*.js'],
		clientCSS: ['public/modules/**/*.css'],
		mochaTests: ['app/tests/**/*.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			}
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
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
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': '<%= applicationCSSFiles %>'
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverJS)
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
        ngmin: {
            production: {
                files: {
                    'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
                }
            }
        },
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
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
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		doxx: {
	    all: {
	      src: 'app',
	      target: 'docs/doxx',
	      options: {
	        // Task-specific options go here.
					title: 'Documentation',
        	ignore: 'tests,public,coverage,docs,node_modules,log,logs,.grunt',
	      }
	    }
	  },
		ngdocs: {
		  options: {
		    dest: 'docs/ngdocs',
		    scripts: [
					'public/lib/angular/angular.js',
					'public/lib/angular-animate/angular-animate.js'
				],
		    html5Mode: false,
		    startPage: '/api',
		    title: 'My Documentation',
		    // analytics: {
		    //       account: 'UA-08150815-0',
		    //       domainName: 'my-domain.com'
		    // },
		  //   discussions: {
		  //         shortName: 'my',
		  //         url: 'http://my-domain.com',
		  //         dev: false
		  //   }
		  },
		  // tutorial: {
		  //   src: ['content/tutorial/*.ngdoc'],
		  //   title: 'Tutorial'
		  // },
		  api: {
		    src: watchFiles.clientJS,
		    title: 'API Documentation'
		  }
		},
		clean: {
		  docs: ['docs'],
		},
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./app/config/init')();
		var config = require('./app/config/config');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['lint', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'ngmin', 'uglify', 'cssmin']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'lint','mochaTest', 'karma:unit', 'docs']);
	grunt.registerTask('test:ui', ['env:test', 'lint', 'karma:unit', 'docs']);
	grunt.registerTask('test:server', ['env:test','lint', 'mochaTest', 'docs']);

	grunt.registerTask('docs', ['clean:docs', 'ngdocs', 'doxx']);
};
