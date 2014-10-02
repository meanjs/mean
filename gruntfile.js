'use strict';

var shelljs = require('shelljs');
var http = require('http');
var format = require('string-template');

module.exports = function(grunt) {
  // Unified Watch Object
  var watchFiles = {
    serverViews: ['app/views/**/*.*'],
    serverJS: ['gruntfile.js', 'server.js', 'app/**/*.js'],
    nodeFiles: ['server.js', 'app/**/*.js'],
    clientViews: ['public/modules/**/views/**/*.html'],
    clientJS: ['public/*.js', 'public/modules/*/js/**/*.js'],
    clientCSS: ['public/modules/**/*.css'],
    mochaTests: ['./app/tests/_globals.js','app/tests/integration/**/*.js', 'app/tests/unit/**/*.js']
  };

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta:{
      reports: '.reports',
      files: watchFiles
    },
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
    ngAnnotate: {
        options: {
            singleQuotes: true,
        },
        production: {
            files: {
                'public/dist/application.js': ['<%= applicationJavaScriptFiles %>']
            }
        }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      docs: ['doxx:shell', 'ngdocs', 'plato'],
      test: ['test:ui', 'test:server'],
      robot: ['startApp:robot', 'test:robot:cov'],
      options: {
        logConcurrentOutput: true,
        limit: 6
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    ngdocs: {
      options: {
        dest: '<%= meta.reports %>/docs/ngdocs',
        scripts: [
          'public/lib/bower_components/angular/angular.js',
          'public/lib/bower_components/angular-animate/angular-animate.js'
        ],
        html5Mode: false,
        startPage: '/api',
        title: 'NgApp Documentation',
      },
      api: {
        src: watchFiles.clientJS,
        title: 'API Documentation'
      }
    },
    clean: {
      docs: ['<%= meta.reports %>/docs'],
      coverage: ['<%= meta.reports %>/coverage'],
      robot: ['<%= meta.reports %>/coverage/robot', 'download'],
      download: ['download'],
      istanbul:['<%= meta.reports %>/coverage/server/app', '<%= meta.reports %>/coverage/server/server.js']
    },
    plato: {
      server: {
        options:{
          jshint : grunt.file.readJSON('.jshintrc'),
          exclude: /app\/tests/,
        },
        files: {
          '<%= meta.reports %>/plato/server': ['server.js', 'app/**/*.js']
        }
      },
      ui: {
        options:{
          //generate patterns: http://www.jslab.dk/tools.regex.php
          // regex's separated by pipe |
          // this pattern excludes tests, distributions and public libs
          exclude: /public\/lib|public\/modules\/([^/]+)\/tests|public\/dist/,
          jshint : grunt.file.readJSON('.jshintrc')
        },
        files: {
          '<%= meta.reports %>/plato/ui': [ 'public/**/*.js']
        }
      }
    },
    waitServer: {
      server: {
        options: {
          url: 'http://localhost:3000',
          fail: function () {process.exit(6);},
          timeout: 10 * 10000,
          isforce: false,
          interval: 8000,
          print: true
        }
      }
    }
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

  // A task for generating documentation using doxx CLI
  grunt.task.registerTask('doxx:shell', 'documentation', function() {
    var options = {
      ignore: 'tests,views',
      source: 'app',
      dest: grunt.config.process('<%= meta.reports %>') + '/docs/doxx',
      title: 'Documentation'
    };

    var template = './node_modules/doxx/bin/doxx --source {source} --target \'{dest}\' --ignore \'{ignore}\' -t \'{title}\'';
    var command = format(template, options);
    var result = shelljs.exec(command);

    if(result.code === 0){
      grunt.log.ok(this.name + ' - Documentation created successfully');
    }else{
      grunt.log.error(this.name + ' - ERROR: something went wrong!');
    }
  });

  // A task for running tests with mocha CLI and doing code coverage with istanbul CLI
  grunt.task.registerTask('istanbul:mocha:cover', 'nodejs code coverage', function() {
    var options = {
      configFile: '.istanbul.yml',
      testFiles: 'app/tests/**/*.js',
    };

    var template = 'istanbul cover --config={configFile} node_modules/.bin/_mocha {testFiles}';
    var command = format(template, options);
    var result = shelljs.exec(command);

    if(result.code === 0){
      grunt.log.ok(this.name + ' - Coverage done successfully');
    }else{
      grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
    }
  });

  grunt.task.registerTask('robot:test', 'add code coverage after functional tests', function() {
    var options = {
      output: '.reports/robot',
      testFiles: 'app/tests/functional/tests',
    };

    var template = 'pybot -d {output} {testFiles} ';
    var command = format(template, options);
    var result = shelljs.exec(command);
    if(result.code === 0){
      grunt.log.ok(this.name + ' - done successfully');
    }else{
      grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
    }

  });

  grunt.task.registerTask('robot:getCoverage', 'add code coverage after functional tests', function() {
    var options = {
      output: '.reports/coverage/robot',
      url: 'http://localhost:3000/coverage/download'
    };

    var template = 'wget {url} && unzip download -d {output}';
    var command = format(template, options);
    var result = shelljs.exec(command);
    if(result.code === 0){
      grunt.log.ok(this.name + ' - done successfully');
    }else{
      grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
    }

  });

  grunt.registerTask('exit', 'Just exits.', function() {

      var result = shelljs.exec('killall grunt && killall node');
      if(result.code === 0){
        grunt.log.ok(this.name + ' - done successfully');
      }else{
        grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
      }
      process.exit(0);
  });
  grunt.registerTask('startApp', 'starts the server.', function() {

      var result = shelljs.exec('node server.js');
      if(result.code === 0){
        grunt.log.ok(this.name + ' - done successfully');
      }else{
        grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
      }
      process.exit(0);
  });

  // Default task(s).
  grunt.registerTask('default', ['lint', 'concurrent:default']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint', 'csslint']);

  // Build task(s).
  grunt.registerTask('build', ['lint', 'loadConfig', 'ngAnnotate', 'uglify', 'cssmin']);

  // Test task.
  grunt.registerTask('test', ['clean:coverage', 'lint','concurrent:test']);
  grunt.registerTask('test:ui', ['env:test', 'karma:unit']);
  grunt.registerTask('test:server', ['istanbul:mocha:cover', 'clean:istanbul']);
  grunt.registerTask('test:robot:cov', [ 'clean:robot', 'waitServer','robot:test', 'robot:getCoverage', 'clean:download', 'exit']);
  grunt.registerTask('test:robot', ['concurrent:robot']);
  grunt.registerTask('startApp:robot', ['startApp', 'watch']);

  grunt.registerTask('docs', ['clean:docs', 'concurrent:docs' ]);
};
