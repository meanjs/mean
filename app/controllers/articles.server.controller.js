'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Article = mongoose.model('Article'),
	_ = require('lodash'),
    articleService = require('../services/articles.server.service');

/**
 * Create a article
 */
exports.create = function(req, res) {
    articleService.create(req.body, req.user, function(err, article){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.jsonp(article);
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.jsonp(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
    articleService.update(req.article, req.body, function(err, article){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}

        res.jsonp(article);
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {

    articleService.delete(req.article, function(err, article){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}

        res.jsonp(article);
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
    articleService.list(req.user, function(err, articles){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}

        res.jsonp(articles);
	});
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
    articleService.articleById(id, function(err, article){
		if (err) {
            return next(err);
        }

		req.article = article;
		next();
	});
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};