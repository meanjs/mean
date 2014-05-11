'use strict';

module.exports = function(grunt) {
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
            production: {
                options: {
                    mangle: false
                },
                files: {
                    'public/dist/application.min.js': '<%= applicationJavaScriptFiles %>'
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

    // Load NPM tasks 
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    // grunt.option('force', true);

    // A Task for loading the configuration object
    grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
    	var MEAN = require('mean-core');
    	var application = new MEAN();

    	grunt.config.set('applicationJavaScriptFiles', application.config.assets.js);
    	grunt.config.set('applicationCSSFiles', application.config.assets.css);
    });

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'csslint', 'concurrent']);

    // Lint task(s).
    grunt.registerTask('lint', ['jshint', 'csslint']);

    // Build task(s).
    grunt.registerTask('build', ['jshint', 'csslint', 'loadConfig' ,'uglify', 'cssmin']);

    // Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};