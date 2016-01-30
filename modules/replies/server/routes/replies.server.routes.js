'use strict';

/**
 * Module dependencies.
 */
var repliesPolicy = require('../policies/replies.server.policy'),
  replies = require('../controllers/replies.server.controller');

module.exports = function (app) {
  // Replies collection routes
  app.route('/api/replies').all(repliesPolicy.isAllowed)
    .get(replies.list)
    .post(replies.create);

  // Single reply routes
  app.route('/api/replies/:replyId').all(repliesPolicy.isAllowed)
    .get(replies.read)
    .put(replies.update)
    .delete(replies.delete);

  // Finish by binding the reply middleware
  app.param('replyId', replies.replyByID);
};
