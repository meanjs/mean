'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  article;

/**
 * Article routes tests
 */
describe('Article CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
      approvedStatus: true
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local',
      approvedStatus: true
    });

    // Save a user to the test db and create new article
    user.save()
      .then(function () {
        article = {
          title: 'Article Title',
          content: 'Article Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an article if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/articles')
          .send(article)
          .expect(403)
          .end(function (articleSaveErr, articleSaveRes) {
            // Call the assertion callback
            done(articleSaveErr);
          });

      });
  });

  it('should not be able to save an article if not logged in', function (done) {
    agent.post('/api/articles')
      .send(article)
      .expect(403)
      .end(function (articleSaveErr, articleSaveRes) {
        // Call the assertion callback
        done(articleSaveErr);
      });
  });

  it('should not be able to update an article if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/articles')
          .send(article)
          .expect(403)
          .end(function (articleSaveErr, articleSaveRes) {
            // Call the assertion callback
            done(articleSaveErr);
          });
      });
  });

  it('should be able to get a list of articles if not signed in', function (done) {
    // Create new article model instance
    var articleObj = new Article(article);

    // Save the article
    articleObj.save(function () {
      // Request articles
      agent.get('/api/articles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should return proper error for single article with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/articles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Article is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single article which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent article
    agent.get('/api/articles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No article with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an article if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/articles')
          .send(article)
          .expect(403)
          .end(function (articleSaveErr, articleSaveRes) {
            // Call the assertion callback
            done(articleSaveErr);
          });
      });
  });

  it('should not be able to delete an article if not signed in', function (done) {
    // Set article user
    article.user = user;

    // Create new article model instance
    var articleObj = new Article(article);

    // Save the article
    articleObj.save(function () {
      // Try deleting article
      agent.delete('/api/articles/' + articleObj._id)
        .expect(403)
        .end(function (articleDeleteErr, articleDeleteRes) {
          // Set message assertion
          (articleDeleteRes.body.message).should.match('User is not yet approved for database changes (check attribute approvedStatus)');

          // Handle article error error
          done(articleDeleteErr);
        });

    });
  });

  it('should be able to get a single article that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3',
      approvedStatus: true
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin'],
      approvedStatus: true
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new article
          agent.post('/api/articles')
            .send(article)
            .expect(200)
            .end(function (articleSaveErr, articleSaveRes) {
              // Handle article save error
              if (articleSaveErr) {
                return done(articleSaveErr);
              }

              // Set assertions on new article
              (articleSaveRes.body.title).should.equal(article.title);
              should.exist(articleSaveRes.body.user);
              should.equal(articleSaveRes.body.user._id, orphanId);

              // force the article to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the article
                    agent.get('/api/articles/' + articleSaveRes.body._id)
                      .expect(200)
                      .end(function (articleInfoErr, articleInfoRes) {
                        // Handle article error
                        if (articleInfoErr) {
                          return done(articleInfoErr);
                        }

                        // Set assertions
                        (articleInfoRes.body._id).should.equal(articleSaveRes.body._id);
                        (articleInfoRes.body.title).should.equal(article.title);
                        should.equal(articleInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single article if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new article model instance
    var articleObj = new Article(article);

    // Save the article
    articleObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/articles/' + articleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', article.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single article, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'articleowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Article
    var _articleOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _articleOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Article
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new article
          agent.post('/api/articles')
            .send(article)
            .expect(200)
            .end(function (articleSaveErr, articleSaveRes) {
              // Handle article save error
              if (articleSaveErr) {
                return done(articleSaveErr);
              }

              // Set assertions on new article
              (articleSaveRes.body.title).should.equal(article.title);
              should.exist(articleSaveRes.body.user);
              should.equal(articleSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the article
                  agent.get('/api/articles/' + articleSaveRes.body._id)
                    .expect(200)
                    .end(function (articleInfoErr, articleInfoRes) {
                      // Handle article error
                      if (articleInfoErr) {
                        return done(articleInfoErr);
                      }

                      // Set assertions
                      (articleInfoRes.body._id).should.equal(articleSaveRes.body._id);
                      (articleInfoRes.body.title).should.equal(article.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (articleInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Article.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
