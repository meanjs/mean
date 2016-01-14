'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  defaultAssets = require('./config/assets/default'),
  testAssets = require('./config/assets/test'),
  glob = require('glob'),
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  plugins = gulpLoadPlugins({
    rename: {
      'gulp-angular-templatecache': 'templateCache'
    }
  }),
  pngquant = require('imagemin-pngquant'),
  path = require('path'),
  endOfLine = require('os').EOL,
  argv = require('yargs').argv,
  protractor = require('gulp-protractor').protractor,
  webdriver_update = require('gulp-protractor').webdriver_update,
  webdriver_standalone = require('gulp-protractor').webdriver_standalone,
  KarmaServer = require('karma').Server;

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
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

// Watch Files For Changes
gulp.task('watch', function () {
  // Start livereload
  plugins.livereload.listen();

  // Add watch rules
  gulp.watch(defaultAssets.server.views).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.server.allJS, ['jshint']).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.js, ['jshint']).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.sass, ['sass', 'csslint']).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.less, ['less', 'csslint']).on('change', plugins.livereload.changed);

  if (process.env.NODE_ENV === 'production') {
    gulp.watch(defaultAssets.server.gulpConfig, ['templatecache', 'jshint']);
    gulp.watch(defaultAssets.client.views, ['templatecache', 'jshint']).on('change', plugins.livereload.changed);
  } else {
    gulp.watch(defaultAssets.server.gulpConfig, ['jshint']);
    gulp.watch(defaultAssets.client.views).on('change', plugins.livereload.changed);
  }

  if (process.env.NODE_ENV === 'test') {
    // Add Server Test file rules
    gulp.watch([testAssets.tests.server, defaultAssets.server.allJS], ['test:server']).on('change', function (file) {
      var runOnlyChangedTestFile = argv.onlyChanged ? true : false;

      // check if we should only run a changed test file
      if (runOnlyChangedTestFile) {
        var changedTestFiles = [];

        // iterate through server test glob patterns
        _.forEach(testAssets.tests.server, function (pattern) {
          // determine if the changed (watched) file is a server test
          _.forEach(glob.sync(pattern), function (f) {
            var filePath = path.resolve(f);

            if (filePath === path.resolve(file.path)) {
              changedTestFiles.push(f);
            }
          });
        });

        // set task argument for tracking changed test files
        argv.changedTestFiles = changedTestFiles;
      }

      plugins.livereload.changed();
    });
  }
});

// CSS linting task
gulp.task('csslint', function (done) {
  return gulp.src(defaultAssets.client.css)
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.reporter())
    .pipe(plugins.csslint.reporter(function (file) {
      if (!file.csslint.errorCount) {
        done();
      }
    }));
});

// JS linting task
gulp.task('jshint', function () {
  var assets = _.union(
    defaultAssets.server.gulpConfig,
    defaultAssets.server.allJS,
    defaultAssets.client.js,
    testAssets.tests.server,
    testAssets.tests.client,
    testAssets.tests.e2e
  );

  return gulp.src(assets)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.jshint.reporter('fail'));
});

// ESLint JS linting task
gulp.task('eslint', function () {
  var assets = _.union(
    defaultAssets.server.gulpConfig,
    defaultAssets.server.allJS,
    defaultAssets.client.js,
    testAssets.tests.server,
    testAssets.tests.client,
    testAssets.tests.e2e
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

// JS minifying task
gulp.task('uglify', function () {
  var assets = _.union(
    defaultAssets.client.js,
    defaultAssets.client.templates
  );

  return gulp.src(assets)
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify({
      mangle: false
    }))
    .pipe(plugins.concat('application.min.js'))
    .pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', function () {
  return gulp.src(defaultAssets.client.css)
    .pipe(plugins.cssmin())
    .pipe(plugins.concat('application.min.css'))
    .pipe(gulp.dest('public/dist'));
});

// Sass task
gulp.task('sass', function () {
  return gulp.src(defaultAssets.client.sass)
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.rename(function (file) {
      file.dirname = file.dirname.replace(path.sep + 'scss', path.sep + 'css');
    }))
    .pipe(gulp.dest('./modules/'));
});

// Less task
gulp.task('less', function () {
  return gulp.src(defaultAssets.client.less)
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.rename(function (file) {
      file.dirname = file.dirname.replace(path.sep + 'less', path.sep + 'css');
    }))
    .pipe(gulp.dest('./modules/'));
});

// Imagemin task
gulp.task('imagemin', function () {
  return gulp.src(defaultAssets.client.img)
    .pipe(plugins.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('public/dist/img'));
});

// Angular template cache task
gulp.task('templatecache', function () {
  var re = new RegExp('\\' + path.sep + 'client\\' + path.sep, 'g');

  return gulp.src(defaultAssets.client.views)
    .pipe(plugins.templateCache('templates.js', {
      root: 'modules/',
      module: 'core',
      templateHeader: '(function () {' + endOfLine + '	\'use strict\';' + endOfLine + endOfLine + '	angular' + endOfLine + '		.module(\'<%= module %>\'<%= standalone %>)' + endOfLine + '		.run(templates);' + endOfLine + endOfLine + '	templates.$inject = [\'$templateCache\'];' + endOfLine + endOfLine + '	function templates($templateCache) {' + endOfLine,
      templateBody: '		$templateCache.put(\'<%= url %>\', \'<%= contents %>\');',
      templateFooter: '	}' + endOfLine + '})();' + endOfLine,
      transformUrl: function (url) {
        return url.replace(re, path.sep);
      }
    }))
    .pipe(gulp.dest('build'));
});

// Mocha tests task
gulp.task('mocha', function (done) {
  // Open mongoose connections
  var mongoose = require('./config/lib/mongoose.js');
  var testSuites = Array.isArray(argv.changedTestFiles) && argv.changedTestFiles.length ? argv.changedTestFiles : testAssets.tests.server;
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

// Karma test runner task
gulp.task('karma', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

// Drops the MongoDB database, used in e2e testing
gulp.task('dropdb', function (done) {
  // Use mongoose configuration
  var mongoose = require('./config/lib/mongoose.js');

  mongoose.connect(function (db) {
    db.connection.db.dropDatabase(function (err) {
      if(err) {
        console.log(err);
      } else {
        console.log('Successfully dropped db: ', db.connection.db.databaseName);
      }
      db.connection.db.close(done);
    });
  });
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

// Start the standalone selenium server
// NOTE: This is not needed if you reference the
// seleniumServerJar in your protractor.conf.js
gulp.task('webdriver_standalone', webdriver_standalone);

// Protractor test runner task
gulp.task('protractor', ['webdriver_update'], function () {
  gulp.src([])
    .pipe(protractor({
      configFile: 'protractor.conf.js'
    }))
    .on('end', function() {
      console.log('E2E Testing complete');
      // exit with success.
      process.exit(0);
    })
    .on('error', function(err) {
      console.log('E2E Tests failed');
      process.exit(1);
    });
});

// Lint CSS and JavaScript files.
gulp.task('lint', function (done) {
  runSequence('less', 'sass', ['csslint', 'eslint', 'jshint'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build', function (done) {
  runSequence('env:dev', 'lint', ['uglify', 'cssmin'], done);
});

// Run the project tests
gulp.task('test', function (done) {
  runSequence('env:test', 'lint', 'mocha', 'karma', 'nodemon', 'protractor', done);
});

gulp.task('test:server', function (done) {
  runSequence('env:test', 'lint', 'mocha', done);
});

// Watch all server files for changes & run server tests (test:server) task on changes
// optional arguments: 
//    --onlyChanged - optional argument for specifying that only the tests in a changed Server Test file will be run
// example usage: gulp test:server:watch --onlyChanged
gulp.task('test:server:watch', function (done) {
  runSequence('test:server', 'watch', done);
});

gulp.task('test:client', function (done) {
  runSequence('env:test', 'lint', 'karma', done);
});

gulp.task('test:e2e', function (done) {
  runSequence('env:test', 'lint', 'dropdb', 'nodemon', 'protractor', done);
});

// Run the project in development mode
gulp.task('default', function (done) {
  runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});

// Run the project in debug mode
gulp.task('debug', function (done) {
  runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
  runSequence('templatecache', 'build', 'env:prod', 'lint', ['nodemon', 'watch'], done);
});
