'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  glob = require('glob'),
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  plugins = gulpLoadPlugins(),
  path = require('path'),
  del = require('del');

var defaultAssets = require('./config/assets/default');
var changedTestFiles = [];

// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
  process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
  process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {
  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: ['--debug'],
    ext: 'js,html',
    verbose: true,
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

// Nodemon task without verbosity or debugging
gulp.task('nodemon-nodebug', function () {
  return plugins.nodemon({
    script: 'server.js',
    ext: 'js,html',
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

// Watch Files For Changes
gulp.task('watch', function () {
  // Start livereload
  plugins.refresh.listen();

  // Add watch rules
  gulp.watch(defaultAssets.server.views).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.server.allJS, ['eslint']).on('change', plugins.refresh.changed);

  if (process.env.NODE_ENV === 'production') {
    gulp.watch(defaultAssets.server.gulpConfig, ['eslint']);
  } else {
    gulp.watch(defaultAssets.server.gulpConfig, ['eslint']);
  }
});

// Watch server test files
gulp.task('watch:server:run-tests', function () {
  // Start livereload
  plugins.refresh.listen();

  // Add Server Test file rules
  gulp.watch([defaultAssets.server.tests, defaultAssets.server.allJS], ['test:server']).on('change', function (file) {
    changedTestFiles = [];

    // iterate through server test glob patterns
    _.forEach(defaultAssets.server.tests, function (pattern) {
      // determine if the changed (watched) file is a server test
      _.forEach(glob.sync(pattern), function (f) {
        var filePath = path.resolve(f);

        if (filePath === path.resolve(file.path)) {
          changedTestFiles.push(f);
        }
      });
    });

    plugins.refresh.changed();
  });
});

// ESLint JS linting task
gulp.task('eslint', function () {
  var assets = _.union(
    defaultAssets.server.gulpConfig,
    defaultAssets.server.allJS,
    defaultAssets.server.tests
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

// Copy local development environment config example
gulp.task('copyLocalEnvConfig', function () {
  var src = [];
  var renameTo = 'local-development.js';

  // only add the copy source if our destination file doesn't already exist
  if (!fs.existsSync('config/env/' + renameTo)) {
    src.push('config/env/local.example.js');
  }

  return gulp.src(src)
    .pipe(plugins.rename(renameTo))
    .pipe(gulp.dest('config/env'));
});

// Make sure upload directory exists
gulp.task('makeUploadsDir', function () {
  return fs.mkdir(process.cwd() + '/uploads', function (err) {
    if (err && err.code !== 'EEXIST') {
      console.error(err);
    }
  });
});

// Mocha tests task
gulp.task('mocha', function (done) {
  // Open mongoose connections
  var mongoose = require('./config/lib/mongoose.js');
  var testSuites = changedTestFiles.length ? changedTestFiles : defaultAssets.server.tests;
  var error;

  // Connect mongoose
  mongoose.connect(function () {
    mongoose.loadModels();
    // Run the tests
    gulp.src(testSuites)
      .pipe(plugins.mocha({
        reporter: 'spec',
        timeout: 10000
      }))
      .on('error', function (err) {
        // If an error occurs, save it
        error = err;
      })
      .on('end', function () {
        // When the tests are done, disconnect mongoose and pass the error state back to gulp
        mongoose.disconnect(function () {
          done(error);
        });
      });
  });
});

// Prepare istanbul coverage test
gulp.task('pre-test', function () {

  // Display coverage for all server JavaScript files
  return gulp.src(defaultAssets.server.allJS)
    // Covering files
    .pipe(plugins.istanbul())
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire());
});

// Run istanbul test and write report
gulp.task('mocha:coverage', ['pre-test', 'mocha'], function () {
  var testSuites = changedTestFiles.length ? changedTestFiles : defaultAssets.server.tests;

  return gulp.src(testSuites)
    .pipe(plugins.istanbul.writeReports({
      reportOpts: { dir: './coverage/server' }
    }));
});

// Lint CSS and JavaScript files.
gulp.task('lint', function (done) {
  runSequence('eslint', done);
});

// Run the project tests
gulp.task('test', function (done) {
  runSequence('env:test', 'test:server', 'nodemon', done);
});

gulp.task('test:server', function (done) {
  runSequence('env:test', ['copyLocalEnvConfig', 'makeUploadsDir'], 'mocha', done);
});

// Watch all server files for changes & run server tests (test:server) task on changes
gulp.task('test:server:watch', function (done) {
  runSequence('test:server', 'watch:server:run-tests', done);
});

gulp.task('test:coverage', function (done) {
  runSequence('env:test', ['copyLocalEnvConfig', 'makeUploadsDir'], 'mocha:coverage', done);
});

// Run the project in development mode
gulp.task('default', function (done) {
  runSequence('env:dev', ['copyLocalEnvConfig', 'makeUploadsDir'], ['nodemon', 'watch'], done);
});

// Run the project in debug mode
gulp.task('debug', function (done) {
  runSequence('env:dev', ['copyLocalEnvConfig', 'makeUploadsDir'], ['nodemon-nodebug', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
  runSequence(['copyLocalEnvConfig', 'makeUploadsDir'], 'env:prod', ['nodemon-nodebug', 'watch'], done);
});
