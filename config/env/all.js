'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    app: {
        title: 'MeanJS',
        description: 'Fullstack JavaScript with MongoDB, Express, AngularJS, and Node.js',
        keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
    },
    root: rootPath,
    port: process.env.PORT || 3000
};