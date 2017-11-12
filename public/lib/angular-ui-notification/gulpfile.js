var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var csscomb = require('gulp-csscomb');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var header = require('gulp-header');
var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require("gulp-minify-html");
var concat = require('gulp-concat');
var addsrc = require('gulp-add-src');
var order = require("gulp-order");
var protractor = require("gulp-protractor").protractor;

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @author <%= pkg.author %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

  // ==== Styles
gulp.task('styles', function() {
    gulp.src('src/build.less')
        .pipe(less({
            strictMath: true
        }))
        .pipe(csscomb())
        .pipe(header(banner, { pkg : pkg }))
        .pipe(rename({
            basename: 'angular-ui-notification'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, { pkg : pkg }))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('demo'));
});

// ====== Templates
gulp.task('templates', function() {
    gulp.src(['*.html'], {cwd: 'src'})
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(templateCache({
            module: 'ui-notification'
        }))
        .pipe(rename('angular-ui-notification.templates.js'))
        .pipe(gulp.dest("build"));
});

gulp.task('service', function() {
    gulp.src(['src/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
        .pipe(ngAnnotate())
        .pipe(addsrc('build/*.js'))
        .pipe(order([
            'src/*.js',
            'build/angular-ui-notification.templates.js'
        ]))
        .pipe(concat('angular-ui-notification.js'))

        .pipe(header(banner, { pkg : pkg }))
        .pipe(gulp.dest('dist'))

        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, { pkg : pkg }))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('demo'));
});

// ======
gulp.task('e2eTest', function() {
    gulp.src(['./test/**/*_spec.js'])
        .pipe(protractor({
            configFile: "protractor_conf.js"
        }))
        .on('error', function(e) {throw e});
});

gulp.task('tests', ['e2eTest']);
gulp.task('build', ['templates', 'service', 'styles']);
gulp.task('deploy', ['build', 'tests']);

gulp.task('default', ['deploy'], function() {});