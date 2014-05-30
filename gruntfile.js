'use strict';

module.exports = function(grunt) {
<<<<<<< HEAD
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            serverViews: {
                files: ['modules/*/views/**'],
                options: {
                    livereload: true,
                }
            },
            serverJS: {
                files: ['gruntfile.js', 'server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                }
            },
            clientViews: {
                files: ['modules/*/client/views/*.html'],
                options: {
                    livereload: true,
                }
            },
            clientJS: {
                files: ['public/*.js', 'modules/*/client/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                }
            },
            clientCSS: {
                files: ['modules/*/client/css/*.css'],
                tasks: ['csslint'],
                options: {
                    livereload: true,
                }
            }
        },
        jshint: {
            all: {
                src: ['gruntfile.js', 'server.js', 'config/**/*.js', 'modules/**/*.js', 'public/*.js'],
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
                src: ['modules/**/css/*.css']
            }
        },
        uglify: {
=======
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'], 
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		clientViews: ['public/modules/**/views/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
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
>>>>>>> 0.3.2
            production: {
                files: {
                    'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
                }
            }
        },
<<<<<<< HEAD
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
            src: ['modules/*/server/tests/**/*.js'],
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
=======
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
		}
	});

	// Load NPM tasks 
	require('load-grunt-tasks')(grunt);
>>>>>>> 0.3.2

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

<<<<<<< HEAD
    // Making grunt default to force in order not to break the project.
    // grunt.option('force', true);

    // A Task for loading the configuration object
    grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
    	var MEAN = require('mean-core');
    	var application = new MEAN();

    	grunt.config.set('applicationJavaScriptFiles', application.config.assets.js);
    	grunt.config.set('applicationCSSFiles', application.config.assets.css);
    });
=======
	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./config/init')();
		var config = require('./config/config');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['lint', 'concurrent:default']);
>>>>>>> 0.3.2

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'ngmin', 'uglify', 'cssmin']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};