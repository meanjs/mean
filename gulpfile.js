'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  defaultAssets = require('./config/assets/default'),
  testAssets = require('./config/assets/test'),
  testConfig = require('./config/env/test'),
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
  wiredep = require('wiredep').stream,
  path = require('path'),
  endOfLine = require('os').EOL,
  del = require('del'),
  semver = require('semver');

// Local settings
var changedTestFiles = [];

// Set NODE_ENV to 'test'
gulp.task('env:test', () => {
  process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', () => {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', () => {
  process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', () => {

  // Node.js v7 and newer use different debug argument
  var debugArgument = semver.satisfies(process.versions.node, '>=7.0.0') ? '--inspect' : '--debug';

  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: [debugArgument],
    ext: 'js,html',
    verbose: true,
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

// Nodemon task without verbosity or debugging
gulp.task('nodemon-nodebug', () => plugins.nodemon({
  script: 'server.js',
  ext: 'js,html',
  watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
}));

// Watch Files For Changes
gulp.task('watch', () => {
  // Start livereload
  plugins.refresh.listen();

  // Add watch rules
  gulp.watch(defaultAssets.server.views).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.server.allJS, ['eslint']).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.client.js, ['eslint']).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.client.sass, ['sass', 'csslint']).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.client.less, ['less', 'csslint']).on('change', plugins.refresh.changed);

  if (process.env.NODE_ENV === 'production') {
    gulp.watch(defaultAssets.server.gulpConfig, ['templatecache', 'eslint']);
    gulp.watch(defaultAssets.client.views, ['templatecache']).on('change', plugins.refresh.changed);
  } else {
    gulp.watch(defaultAssets.server.gulpConfig, ['eslint']);
    gulp.watch(defaultAssets.client.views).on('change', plugins.refresh.changed);
  }
});

// Watch server test files
gulp.task('watch:server:run-tests', () => {
  // Start livereload
  plugins.refresh.listen();

  // Add Server Test file rules
  gulp.watch([testAssets.tests.server, defaultAssets.server.allJS], ['test:server']).on('change', file => {
    changedTestFiles = [];

    // iterate through server test glob patterns
    _.forEach(testAssets.tests.server, pattern => {
      // determine if the changed (watched) file is a server test
      _.forEach(glob.sync(pattern), f => {
        var filePath = path.resolve(f);

        if (filePath === path.resolve(file.path)) {
          changedTestFiles.push(f);
          plugins.refresh.changed(f);
        }
      });
    });
  });
});

// CSS linting task
gulp.task('csslint', () => // Don't fail CSS issues yet
// .pipe(plugins.csslint.failFormatter());
gulp.src(defaultAssets.client.css)
  .pipe(plugins.csslint('.csslintrc'))
  .pipe(plugins.csslint.formatter()));

// ESLint JS linting task
gulp.task('eslint', () => {
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
gulp.task('uglify', () => {
  var assets = _.union(
    defaultAssets.client.js,
    defaultAssets.client.templates
  );
  del(['public/dist/*']);

  return gulp.src(assets)
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify({
      mangle: true
    }).on('error', err => {
      console.log('Uglify error : ', err.toString());
    }))
    .pipe(plugins.concat('application.min.js'))
    .pipe(plugins.rev())
    .pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', () => gulp.src(defaultAssets.client.css)
  .pipe(plugins.csso())
  .pipe(plugins.concat('application.min.css'))
  .pipe(plugins.rev())
  .pipe(gulp.dest('public/dist')));

// Sass task
gulp.task('sass', () => gulp.src(defaultAssets.client.sass)
  .pipe(plugins.sass())
  .pipe(plugins.autoprefixer())
  .pipe(gulp.dest('./modules/')));

// Less task
gulp.task('less', () => gulp.src(defaultAssets.client.less)
  .pipe(plugins.less())
  .pipe(plugins.autoprefixer())
  .pipe(gulp.dest('./modules/')));

// Imagemin task
gulp.task('imagemin', () => gulp.src(defaultAssets.client.img)
  .pipe(plugins.imagemin({
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('public/dist/img')));

// wiredep task to default
gulp.task('wiredep', () => gulp.src('config/assets/default.js')
  .pipe(wiredep({
    ignorePath: '../../'
  }))
  .pipe(gulp.dest('config/assets/')));

// wiredep task to production
gulp.task('wiredep:prod', () => gulp.src('config/assets/production.js')
  .pipe(wiredep({
    ignorePath: '../../',
    fileTypes: {
      js: {
        replace: {
          css: function (filePath) {
            var minFilePath = filePath.replace('.css', '.min.css');
            var fullPath = path.join(process.cwd(), minFilePath);
            if (!fs.existsSync(fullPath)) {
              return '\'' + filePath + '\',';
            } else {
              return '\'' + minFilePath + '\',';
            }
          },
          js: function (filePath) {
            var minFilePath = filePath.replace('.js', '.min.js');
            var fullPath = path.join(process.cwd(), minFilePath);
            if (!fs.existsSync(fullPath)) {
              return '\'' + filePath + '\',';
            } else {
              return '\'' + minFilePath + '\',';
            }
          }
        }
      }
    }
  }))
  .pipe(gulp.dest('config/assets/')));

// Copy local development environment config example
gulp.task('copyLocalEnvConfig', () => {
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
gulp.task('makeUploadsDir', () => fs.mkdir('modules/users/client/img/profile/uploads', err => {
  if (err && err.code !== 'EEXIST') {
    console.error(err);
  }
}));

// Angular template cache task
gulp.task('templatecache', () => gulp.src(defaultAssets.client.views)
  .pipe(plugins.templateCache('templates.js', {
    root: '/modules/',
    module: 'core',
    templateHeader: '(function () {' + endOfLine + '	\'use strict\';' + endOfLine + endOfLine + '	angular' + endOfLine + '		.module(\'<%= module %>\'<%= standalone %>)' + endOfLine + '		.run(templates);' + endOfLine + endOfLine + '	templates.$inject = [\'$templateCache\'];' + endOfLine + endOfLine + '	function templates($templateCache) {' + endOfLine,
    templateBody: '		$templateCache.put(\'<%= url %>\', \'<%= contents %>\');',
    templateFooter: '	}' + endOfLine + '})();' + endOfLine
  }))
  .pipe(gulp.dest('build')));

// Mocha tests task
gulp.task('mocha', done => {
  var mongooseService = require('./config/lib/mongoose');
  var testSuites = changedTestFiles.length ? changedTestFiles : testAssets.tests.server;
  var error;

  // Connect mongoose
  mongooseService.connect(db => {
    // Load mongoose models
    mongooseService.loadModels();

    gulp.src(testSuites)
      .pipe(plugins.mocha({
        reporter: 'spec',
        timeout: 10000
      }))
      .on('error', err => {
        // If an error occurs, save it
        error = err;
      })
      .on('end', () => {
        mongooseService.disconnect(err => {
          if (err) {
            console.log('Error disconnecting from database');
            console.log(err);
          }

          return done(error);
        });
      });
  });
});

// Prepare istanbul coverage test
gulp.task('pre-test', () => // Display coverage for all server JavaScript files
gulp.src(defaultAssets.server.allJS)
  // Covering files
  .pipe(plugins.istanbul())
  // Force `require` to return covered files
  .pipe(plugins.istanbul.hookRequire()));

// Run istanbul test and write report
gulp.task('mocha:coverage', ['pre-test', 'mocha'], () => {
  var testSuites = changedTestFiles.length ? changedTestFiles : testAssets.tests.server;

  return gulp.src(testSuites)
    .pipe(plugins.istanbul.writeReports({
      reportOpts: { dir: './coverage/server' }
    }));
});

// Karma test runner task
gulp.task('karma', done => {
  var KarmaServer = require('karma').Server;
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

// Run karma with coverage options set and write report
gulp.task('karma:coverage', done => {
  var KarmaServer = require('karma').Server;
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    preprocessors: {
      'modules/*/client/views/**/*.html': ['ng-html2js'],
      'modules/core/client/app/config.js': ['coverage'],
      'modules/core/client/app/init.js': ['coverage'],
      'modules/*/client/*.js': ['coverage'],
      'modules/*/client/config/*.js': ['coverage'],
      'modules/*/client/controllers/*.js': ['coverage'],
      'modules/*/client/directives/*.js': ['coverage'],
      'modules/*/client/services/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage/client',
      reporters: [
        { type: 'lcov', subdir: '.' }
        // printing summary to console currently weirdly causes gulp to hang so disabled for now
        // https://github.com/karma-runner/karma-coverage/issues/209
        // { type: 'text-summary' }
      ]
    }
  }, done).start();
});

// Drops the MongoDB database, used in e2e testing
gulp.task('dropdb', done => {
  // Use mongoose configuration
  var mongooseService = require('./config/lib/mongoose');

  mongooseService.connect(db => {
    db.dropDatabase(err => {
      if (err) {
        console.error(err);
      } else {
        console.log('Successfully dropped db: ', db.databaseName);
      }

      mongooseService.disconnect(done);
    });
  });
});

// Seed Mongo database based on configuration
gulp.task('mongo-seed', done => {
  var db = require('./config/lib/mongoose');
  var seed = require('./config/lib/mongo-seed');

  // Open mongoose database connection
  db.connect(() => {
    db.loadModels();

    seed
      .start({
        options: {
          logResults: true
        }
      })
      .then(() => {
        // Disconnect and finish task
        db.disconnect(done);
      })
      .catch(err => {
        db.disconnect(disconnectError => {
          if (disconnectError) {
            console.log('Error disconnecting from the database, but was preceded by a Mongo Seed error.');
          }

          // Finish task with error
          done(err);
        });
      });
  });

});

// Downloads the selenium webdriver if protractor version is compatible
gulp.task('webdriver_update', done => require('gulp-protractor').webdriver_update(done));

// Start the standalone selenium server
// NOTE: This is not needed if you reference the
// seleniumServerJar in your protractor.conf.js
gulp.task('webdriver_standalone', done => require('gulp-protractor').webdriver_standalone(done));

// Protractor test runner task
gulp.task('protractor', ['webdriver_update'], () => {
  var protractor = require('gulp-protractor').protractor;
  gulp.src([])
    .pipe(protractor({
      configFile: 'protractor.conf.js'
    }))
    .on('end', () => {
      console.log('E2E Testing complete');
      // exit with success.
      process.exit(0);
    })
    .on('error', err => {
      console.error('E2E Tests failed:');
      console.error(err);
      process.exit(1);
    });
});

// Lint CSS and JavaScript files.
gulp.task('lint', done => {
  runSequence('less', 'sass', ['csslint', 'eslint'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build', done => {
  runSequence('env:dev', 'wiredep:prod', 'lint', ['uglify', 'cssmin'], done);
});

// Run the project tests
gulp.task('test', done => {
  runSequence('env:test', 'test:server', 'karma', 'nodemon', 'protractor', done);
});

gulp.task('test:server', done => {
  runSequence('env:test', ['copyLocalEnvConfig', 'makeUploadsDir', 'dropdb'], 'lint', 'mocha', done);
});

// Watch all server files for changes & run server tests (test:server) task on changes
gulp.task('test:server:watch', done => {
  runSequence('test:server', 'watch:server:run-tests', done);
});

gulp.task('test:client', done => {
  runSequence('env:test', 'lint', 'dropdb', 'karma', done);
});

gulp.task('test:e2e', done => {
  runSequence('env:test', 'lint', 'dropdb', 'nodemon', 'protractor', done);
});

gulp.task('test:coverage', done => {
  runSequence('env:test', ['copyLocalEnvConfig', 'makeUploadsDir', 'dropdb'], 'lint', 'mocha:coverage', 'karma:coverage', done);
});

// Run the project in development mode with node debugger enabled
gulp.task('default', done => {
  runSequence('env:dev', ['copyLocalEnvConfig', 'makeUploadsDir'], 'lint', ['nodemon', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', done => {
  runSequence(['copyLocalEnvConfig', 'makeUploadsDir', 'templatecache'], 'build', 'env:prod', 'lint', ['nodemon-nodebug', 'watch'], done);
});

// Run Mongo Seed with default environment config
gulp.task('seed', done => {
  runSequence('env:dev', 'mongo-seed', done);
});

// Run Mongo Seed with production environment config
gulp.task('seed:prod', done => {
  runSequence('env:prod', 'mongo-seed', done);
});

gulp.task('seed:test', done => {
  runSequence('env:test', 'mongo-seed', done);
});
