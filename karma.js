// Karma configuration
module.exports = function(config) {
    config.set({
        // frameworks to use
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'public/lib/angular/angular.js',
            'public/lib/angular-mocks/angular-mocks.js',
            'public/lib/angular-cookies/angular-cookies.js',
            'public/lib/angular-resource/angular-resource.js',
            'public/lib/angular-route/angular-route.js',
            'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'public/lib/angular-bootstrap/ui-bootstrap.js',
            'public/lib/angular-ui-utils/modules/route/route.js',
            'public/js/app.js',

            //System module
            'public/modules/system/system.js',
            'public/modules/system/config/routes.js',
            'public/modules/system/config/config.js',
            'public/modules/system/controllers/index.js',
            'public/modules/system/controllers/header.js',
            'public/modules/system/services/global.js',
            'public/modules/system/tests/**/*.js',

            //Articles module
            'public/modules/articles/articles.js',
            'public/modules/articles/config/routes.js',
            'public/modules/articles/controllers/articles.js',
            'public/modules/articles/services/articles.js',
            'public/modules/articles/tests/**/*.js'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        //reporters: ['progress'],
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};