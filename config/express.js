'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
	passport = require('passport'),
	mongoStore = require('connect-mongo')(express),
	flash = require('connect-flash'),
	config = require('./config'),
	consolidate = require('consolidate'),
	path = require('path');

module.exports = function(db) {
	// Initialize express app
	var app = express();

	// Globbing model files
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting the environment locals
	app.locals({
		title: config.app.title,
		description: config.app.description,
		keywords: config.app.keywords,
		facebookAppId: config.facebook.clientID,
		jsFiles: config.getJavaScriptAssets(),
		cssFiles: config.getCSSAssets()
	});

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + ':// ' + req.headers.host + req.url;
		next();
	});

	// Should be placed before express.static
	app.use(express.compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Showing stack errors
	app.set('showStackError', true);

	// Set swig as the template engine
	app.engine('html', consolidate[config.templateEngine]);

	// Set views path and view engine
	app.set('view engine', 'html');
	app.set('views', config.root + '/app/views');

	// Application Configuration for development environment
	app.configure('development', function() {
		// Enable logger
		app.use(express.logger('dev'));

		// Disable views cache
		app.set('view cache', false);
	});

	// Application Configuration for production environment
	app.configure('production', function() {
		app.locals({
			cache: 'memory' // To solve SWIG Cache Issues
		});
	});

	//  request body parsing middleware should be above methodOverride
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.methodOverride());

	// Enable jsonp
	app.enable('jsonp callback');

	// cookieParser should be above session
	app.use(express.cookieParser());

	// express/mongo session storage
	app.use(express.session({
		secret: config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
			collection: config.sessionCollection
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages
	app.use(flash());

	// routes should be at the last
	app.use(app.router);

	// Setting the app router and static folder
	app.use(express.static(config.root + '/public'));

	// Globbing routing files
	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).render('500.html', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404.html', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

	return app;
};