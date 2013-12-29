'use strict';

var passport = require('passport');

module.exports = function(app) {
    //User Routes
    var users = require('../server/controllers/users');
    app.get('/users/me', users.me);

    //Setting up the users api
    app.post('/auth/signup', users.signup);
    app.post('/auth/signin', users.signin);
    app.get('/auth/signout', users.signout);

    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/#!/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/#!/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/#!/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/#!/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/#!/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/#!/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/#!/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/#!/signin'
    }), users.authCallback);

    //Finish by binding the user middleware
    app.param('userId', users.userByID);

    //Article Routes
    var articles = require('../server/controllers/articles');
    app.get('/articles', articles.list);
    app.post('/articles', users.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.read);
    app.put('/articles/:articleId', users.requiresLogin, articles.hasAuthorization, articles.update);
    app.del('/articles/:articleId', users.requiresLogin, articles.hasAuthorization, articles.delete);

    //Finish by binding the article middleware
    app.param('articleId', articles.articleByID);

    //Root routing
    var index = require('../server/controllers/index');
    app.get('/', index.render);

};
