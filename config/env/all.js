'use strict';

var path = require('path'),
	rootPath = path.normalize(__dirname + '/../..');

var port = process.env.PORT || 3000;
var appUrl = process.env.APP_URL || ('http://localhost:' + port);

module.exports = {
	app: {
		title: 'MEAN.JS',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
	},
	root: rootPath,
	port: port,
	appUrl: appUrl,
	templateEngine: 'swig',
	sessionSecret: process.env.SESSION_SECRET || 'MEAN',
	sessionCollection: 'sessions'
};
