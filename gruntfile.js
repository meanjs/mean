'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  defaultAssets = require('./config/assets/default'),
  testAssets = require('./config/assets/test'),
  testConfig = require('./config/env/test'),
  fs = require('fs'),
  path = require('path'),
  wiredep = require('wiredep');

module.exports = function (grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    watch: {
      serverViews: {
        files: defaultAssets.server.views,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS),
        tasks: ['eslint'],
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: defaultAssets.client.views,
        options: {
          livereload: true
        }
      },
      clientJS: {
        files: defaultAssets.client.js,
        tasks: ['eslint'],
        options: {
          livereload: true
        }
      },
      clientCSS: {
        files: defaultAssets.client.css,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      },
      clientSCSS: {
        files: defaultAssets.client.sass,
        tasks: ['sass', 'csslint'],
        options: {
          livereload: true
        }
      },
      clientLESS: {
        files: defaultAssets.client.less,
        tasks: ['less', 'csslint'],
        options: {
          livereload: true
        }
      }
    },
    wiredep: {
      dev: {
        src: 'modules/core/server/views/layout.server.view.html',
        ignorePath: /.*public\//
      },
      production: {
        src: 'modules/core/server/views/layout.server.view.html',
        ignorePath: /.*public\//,
        fileTypes: {
          html: {
            replace: {
              css: function (filePath) {
                var minFilePath = filePath.replace('.css', '.min.css');
                var fullPath = path.join(process.cwd(), 'public', minFilePath);
                if (!fs.existsSync(fullPath)) {
                  return '<link rel="stylesheet" href="' + filePath + '">';
                } else {
                  return '<link rel="stylesheet" href="' + minFilePath + '">';
                }
              },
              js: function (filePath) {
                var minFilePath = filePath.replace('.js', '.min.js');
                var fullPath = path.join(process.cwd(), 'public', minFilePath);
                if (!fs.existsSync(fullPath)) {
                  return '<script type="text/javascript" src="' + filePath + '"></script>';
                } else {
                  return '<script type="text/javascript" src="' + minFilePath + '"></script>';
                }
              }
            }
          }
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
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
    eslint: {
      options: {},
      target: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS, defaultAssets.client.js, testAssets.tests.server, testAssets.tests.client, testAssets.tests.e2e)
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: defaultAssets.client.css
      }
    },
    ngAnnotate: {
      production: {
        files: {
          'public/dist/application.js': defaultAssets.client.js
        }
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
          'public/dist/application.min.css': defaultAssets.client.css
        }
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          src: defaultAssets.client.sass,
          ext: '.css',
          rename: function (base, src) {
            return src.replace('/scss/', '/css/');
          }
        }]
      }
    },
    less: {
      dist: {
        files: [{
          expand: true,
          src: defaultAssets.client.less,
          ext: '.css',
          rename: function (base, src) {
            return src.replace('/less/', '/css/');
          }
        }]
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
    mochaTest: {
      src: testAssets.tests.server,
      options: {
        reporter: 'spec',
        timeout: 10000
      }
    },
    mocha_istanbul: {
      coverage: {
        src: testAssets.tests.server,
        options: {
          print: 'detail',
          coverage: true,
          require: 'test.js',
          coverageFolder: 'coverage/server',
          reportFormats: ['cobertura', 'lcovonly'],
          check: {
            lines: 40,
            statements: 40
          }
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    protractor: {
      options: {
        configFile: 'protractor.conf.js',
        noColor: false,
        webdriverManagerUpdate: true
      },
      e2e: {
        options: {
          args: {} // Target-specific arguments
        }
      }
    },
    copy: {
      localConfig: {
        src: 'config/env/local.example.js',
        dest: 'config/env/local-development.js',
        filter: function () {
          return !fs.existsSync('config/env/local-development.js');
        }
      }
    }
  });

  grunt.event.on('coverage', function(lcovFileContents, done) {
    // Set coverage config so karma-coverage knows to run coverage
    testConfig.coverage = true;
    require('coveralls').handleInput(lcovFileContents, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  // Make sure upload directory exists
  grunt.task.registerTask('mkdir:upload', 'Task that makes sure upload directory exists.', function () {
    // Get the callback
    var done = this.async();

    grunt.file.mkdir(path.normalize(__dirname + '/modules/users/client/img/profile/uploads'));

    done();
  });

  // Connect to the MongoDB instance and load the models
  grunt.task.registerTask('mongoose', 'Task that connects to the MongoDB instance and loads the application models.', function () {
    // Get the callback
    var done = this.async();

    // Use mongoose configuration
    var mongoose = require('./config/lib/mongoose.js');

    // Connect to database
    mongoose.connect(function (db) {
      done();
    });
  });

  // Drops the MongoDB database, used in e2e testing
  grunt.task.registerTask('dropdb', 'drop the database', function () {
    // async mode
    var done = this.async();

    // Use mongoose configuration
    var mongoose = require('./config/lib/mongoose.js');

    mongoose.connect(function (db) {
      db.connection.db.dropDatabase(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully dropped db: ', db.connection.db.databaseName);
        }
        db.connection.db.close(done);
      });
    });
  });

  grunt.task.registerTask('server', 'Starting the server', function () {
    // Get the callback
    var done = this.async();

    var app = require(path.resolve('./config/lib/app'));
    var server = app.start(function () {
      done();
    });
  });

  // Lint CSS and JavaScript files.
  grunt.registerTask('lint', ['sass', 'less', 'eslint', 'csslint']);

  grunt.registerMultiTask('wiredep', 'Inject Bower dependencies.', function () {
    this.requiresConfig(['wiredep', this.target, 'src']);

    var options = this.options(this.data);
    wiredep(options);
  });

  // Lint project files and minify them into two production files.
  grunt.registerTask('build', ['env:dev', 'wiredep:production', 'lint', 'ngAnnotate', 'uglify', 'cssmin']);

  // Run the project tests
  grunt.registerTask('test', ['env:test', 'lint', 'mkdir:upload', 'copy:localConfig', 'server', 'mochaTest', 'karma:unit', 'protractor']);
  grunt.registerTask('test:server', ['env:test', 'lint', 'server', 'mochaTest']);
  grunt.registerTask('test:client', ['env:test', 'lint', 'karma:unit']);
  grunt.registerTask('test:e2e', ['env:test', 'lint', 'dropdb', 'server', 'protractor']);
  // Run project coverage
  grunt.registerTask('coverage', ['env:test', 'lint', 'mocha_istanbul:coverage', 'karma:unit']);

  // Run the project in development mode
  grunt.registerTask('default', ['env:dev', 'wiredep:dev', 'lint', 'mkdir:upload', 'copy:localConfig', 'concurrent:default']);

  // Run the project in debug mode
  grunt.registerTask('debug', ['env:dev', 'lint', 'mkdir:upload', 'copy:localConfig', 'concurrent:debug']);

  // Run the project in production mode
  grunt.registerTask('prod', ['build', 'env:prod', 'mkdir:upload', 'copy:localConfig', 'concurrent:default']);
};
