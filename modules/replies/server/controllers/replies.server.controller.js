'use strict';
/* jshint -W079 */ 

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Reply = mongoose.model('Reply'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a reply
 */
exports.create = function (req, res) {
  // When a new reply is created, two things have to happen:
  // 1) The reply must be created and get an Object ID
  // 2) The object ID must be inserted into the replies array of whatever
  // you are replying to, whether it is another reply or an article itself

  var reply = new Reply(req.body);
  reply.user = req.user;
  // First a sanity check
  if (req.body.nestedLevel > 9) {
    return res.status(400).send({
      message: 'what the sam hell is going on here? we only have comments 9 levels deep'
    });
  } else {
    reply.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // If replyTo is not null, this is a reply to a reply and must be added to the
        // reply array of replies. If replyTo is null, this is a top level reply to a article
        if (reply.replyTo) {
          Reply.findByIdAndUpdate(req.body.replyTo,
            { $push: { 'replies': reply._id } },
            { safe: true, upsert: true, new: true },
            function(err, oldReply) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // lastly, increment the absolute reply count
                Article.findByIdAndUpdate(req.body.article,
                  { $inc: { 'replyCount': 1 } },
                  function (err) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                      res.json(reply);
                    }                    
                  });
              }
            });
        } else {
          Article.findByIdAndUpdate(req.body.article,
            { $push: { 'replies': reply._id },
              $inc: { 'replyCount': 1 } },
            { safe: true },
            function(err, oldReply) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.json(reply);
              }
            });
        }
      }
    });    
  }
};

/**
 * Show the current reply
 */
exports.read = function (req, res) {
  res.json(req.reply);
};

/**
 * Update a reply
 */
exports.update = function (req, res) {
  var reply = req.reply;

  reply.content = req.body.content;
  reply.edited = Date.now();

  reply.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reply);
    }
  });
};

/**
 * Delete a reply
 */
exports.delete = function (req, res) {
  var reply = req.reply;
  // first we gotta pop it out of the array it was in
  // if replyTo is not null, it was attached to a reply
  // if replyTo is null, it was attached to a Article
  if (reply.replyTo) {
    Reply.findByIdAndUpdate(reply.replyTo,
      { $pull: { 'replies': reply._id } },
      { safe: true },
      function(err, oldReply) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          reply.remove(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              // lastly, decrement the absolute reply count
              Article.findByIdAndUpdate(reply.article,
                { $inc: { 'replyCount': -1 } },
                function (err) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    res.json(reply);
                  }                    
                });
            }
          });
        }
      });  
  } else {
    Article.findByIdAndUpdate(reply.article,
      { $pull: { 'replies': reply._id },
        $inc: { 'replyCount': -1 } },
      { safe: true },
      function(err, oldReply) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          reply.remove(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(reply);
            }
          });
        }
      });

  }
};

/**
 * List of Replies
 */
 // TODO: decide if filtering will happen here or only in the UI
exports.list = function (req, res) {
  // This may seem counterintuitive, but we're actually going to find the article that matches
  // the currently viewed article, populate its array of replies, then send back the array of replies
  // I did it this way for speed. You could also search all of the replies in the replies collection
  // for the appropriate article id. I figured that would be slower.
  var sortOps = { sort: { 'created' : -1 } };

  Article.findById(req.query.article)
  .populate({
    path: 'replies',
    options: sortOps,
    populate: [{
      path: 'user',
      select: 'displayName username'
    }, {
      path: 'replies',
      options: sortOps,
      populate: [{
        path: 'user',
        select: 'displayName username'
      }, {
        path: 'replies',
        options: sortOps,
        populate: [{
          path: 'user',
          select: 'displayName username'
        }, {
          path: 'replies',
          options: sortOps,
          populate: [{
            path: 'user',
            select: 'displayName username'
          }, {
            path: 'replies',
            options: sortOps,
            populate: [{
              path: 'user',
              select: 'displayName username'
            }, {
              path: 'replies',
              options: sortOps,
              populate: [{
                path: 'user',
                select: 'displayName username'
              }, {
                path: 'replies',
                options: sortOps,
                populate: [{
                  path: 'user',
                  select: 'displayName username'
                }, {
                  path: 'replies',
                  options: sortOps,
                  populate: [{
                    path: 'user',
                    select: 'displayName username'
                  }, {
                    path: 'replies',
                    options: sortOps,
                    populate: [{
                      path: 'user',
                      select: 'displayName username'
                    }, {
                      path: 'replies',
                      options: sortOps,
                      populate: {
                        path: 'user',
                        select: 'displayName username'
                      }
                    }]
                  }]
                }]
              }]
            }]
          }]
        }]
      }]
    }]
  })
  .exec(function (err, article) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article.replies);
    }
  });
};

/**
 * Reply middleware
 */
exports.replyByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Reply is invalid'
    });
  }

  Reply.findById(id).populate('user', 'displayName').exec(function (err, reply) {
    if (err) {
      return next(err);
    } else if (!reply) {
      return res.status(404).send({
        message: 'No reply with that identifier has been found'
      });
    }
    req.reply = reply;
    next();
  });
};
