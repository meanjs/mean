'use strict';

var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    _ = require('lodash');

/**
 * Create a new article from details
 * @param details - {Object} details to create new article
 * @param user - {User} the user that article belong to
 * @param callback - {Function} in the form of callback(err, article)
 *              err - {Error}
 *              article - {Article}
 */
exports.create = function(details, user, callback){
    var article = new Article(details);
    article.user = user;

    article.save(function(err) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, article);
    });
};

/**
 * Update details for specific article
 * @param article - {Article} to update
 * @param details - {Object} details to update
 * @param callback - {Function} in the form off callback(err, article)
 *              err - {Error}
 *              article - {Article}
 */
exports.update = function(article, details, callback){
    article = _.extend(article, details);

    article.save(function(err) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, article);
    });
};

/**
 * Service to delete an Article
 * @param article - {Aritcle} to delete
 * @param callback - {Function} in the form of callback(err, article)
 *              err - {Error}
 *              article - {Article} that was deleted
 */
exports.delete = function(article, callback){
    article.remove(function(err) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, article);
    });
};

/**
 * Return a list of article for a specific user
 * @param user - {User} for him to find his articles
 * @param callback - {Function} in the form of callback(err, articles)
 *              err - {Error}
 *              articles - {Array} of Articles
 */
exports.list = function(user, callback){
    Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
        if (err) {
            return callback(err, null)
        }

        return callback(null, articles);
    });
};

/**
 * Return article by ID
 * @param id - {String} article id
 * @param callback - {Function} in the form of callback(err, article)
 *          err - {Error}
 *          article - {Article}
 */
exports.articleById = function(id, callback){
    Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
        if (err) {
            return callback(err, null);
        }
        if (!article) {
            return callback(new Error('Failed to load article ' + id), null);
        }

        callback(null, article);
    });
};