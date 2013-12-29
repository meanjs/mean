'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    passport = require('passport'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    config = require('./config'),
    doT = require('express-dot'),
    path = require('path'),
    fs = require('fs');

//Adding walk function to recursively get files
var _walk = function(root, regex, exclude, removePath) {
    var output = [];
    var directories = [];

    //First read through files 
    fs.readdirSync(root).forEach(function(file) {
        var newPath = root + '/' + file;
        var stat = fs.statSync(newPath);

        if (stat.isFile()) {
            if (regex.test(file) && (!exclude || !exclude.test(file))) {
                output.push(newPath.replace(removePath, ''));
            }
        } else if (stat.isDirectory()) {
            directories.push(newPath);
        }
    });

    //Then recursively add directories
    directories.forEach(function(directory) {
        output = output.concat(_walk(directory, regex, exclude, removePath));
    });

    return output;
};

module.exports = function(db) {
    //Initialize express app
    var app = express();

    //Initialize models
    _walk('./server/models', /(.*)\.(js$|coffee$)/).forEach(function(modelPath) {
        require(path.resolve(modelPath));
    });

    //Setting the environment locals
    app.locals({
        title: config.app.title,
        description: config.app.description,
        keywords: config.app.keywords,
        facebookAppId: config.facebook.clientID,
        modulesJSFiles: _walk('./public/modules', /(.*)\.(js)/, /(.*)\.(spec.js)/, './public')
    });

    //Passing the request url to environment locals
    app.use(function(req, res, next) {
        res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        next();
    });

    //Should be placed before express.static
    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    //Showing stack errors
    app.set('showStackError', true);

    //Don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
        app.use(express.logger('dev'));
    }

    //Set views path, template engine and default layout
    app.set('views', config.root + '/server/views');
    app.set('view engine', 'dot');
    app.engine('html', doT.__express);

    // request body parsing middleware should be above methodOverride
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride());

    //Enable jsonp
    app.enable('jsonp callback');

    //cookieParser should be above session
    app.use(express.cookieParser());

    //express/mongo session storage
    app.use(express.session({
        secret: 'MEAN',
        store: new mongoStore({
            db: db.connection.db,
            collection: 'sessions'
        })
    }));

    //connect flash for flash messages
    app.use(flash());

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //routes should be at the last
    app.use(app.router);

    //Setting the app router and static folder
    app.use(express.static(config.root + '/public'));

    //Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function(err, req, res, next) {
        //Treat as 404
        if (~err.message.indexOf('not found')) return next();

        //Log it
        console.error(err.stack);

        //Error page
        res.status(500).render('500.html', {
            error: err.stack
        });
    });

    //Assume 404 since no middleware responded
    app.use(function(req, res) {
        res.status(404).render('404.html', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

    return app;
};