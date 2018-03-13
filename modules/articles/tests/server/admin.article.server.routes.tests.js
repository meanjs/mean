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
describe('Article Admin CRUD tests', () => {
  before(done => {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(done => {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new article
    user.save()
      .then(() => {
        article = {
          title: 'Article Title',
          content: 'Article Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an article if logged in', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/articles')
          .send(article)
          .expect(200)
          .end((articleSaveErr, articleSaveRes) => {
            // Handle article save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Get a list of articles
            agent.get('/api/articles')
              .end((articlesGetErr, articlesGetRes) => {
                // Handle article save error
                if (articlesGetErr) {
                  return done(articlesGetErr);
                }

                // Get articles list
                var articles = articlesGetRes.body;

                // Set assertions
                (articles[0].user._id).should.equal(userId);
                (articles[0].title).should.match('Article Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an article if signed in', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/articles')
          .send(article)
          .expect(200)
          .end((articleSaveErr, articleSaveRes) => {
            // Handle article save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Update article title
            article.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing article
            agent.put('/api/articles/' + articleSaveRes.body._id)
              .send(article)
              .expect(200)
              .end((articleUpdateErr, articleUpdateRes) => {
                // Handle article update error
                if (articleUpdateErr) {
                  return done(articleUpdateErr);
                }

                // Set assertions
                (articleUpdateRes.body._id).should.equal(articleSaveRes.body._id);
                (articleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an article if no title is provided', done => {
    // Invalidate title field
    article.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/articles')
          .send(article)
          .expect(422)
          .end((articleSaveErr, articleSaveRes) => {
            // Set message assertion
            (articleSaveRes.body.message).should.match('Title cannot be blank');

            // Handle article save error
            done(articleSaveErr);
          });
      });
  });

  it('should be able to delete an article if signed in', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/articles')
          .send(article)
          .expect(200)
          .end((articleSaveErr, articleSaveRes) => {
            // Handle article save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Delete an existing article
            agent.delete('/api/articles/' + articleSaveRes.body._id)
              .send(article)
              .expect(200)
              .end((articleDeleteErr, articleDeleteRes) => {
                // Handle article error error
                if (articleDeleteErr) {
                  return done(articleDeleteErr);
                }

                // Set assertions
                (articleDeleteRes.body._id).should.equal(articleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single article if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', done => {
    // Create new article model instance
    article.user = user;
    var articleObj = new Article(article);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/articles')
          .send(article)
          .expect(200)
          .end((articleSaveErr, articleSaveRes) => {
            // Handle article save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Get the article
            agent.get('/api/articles/' + articleSaveRes.body._id)
              .expect(200)
              .end((articleInfoErr, articleInfoRes) => {
                // Handle article error
                if (articleInfoErr) {
                  return done(articleInfoErr);
                }

                // Set assertions
                (articleInfoRes.body._id).should.equal(articleSaveRes.body._id);
                (articleInfoRes.body.title).should.equal(article.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (articleInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(done => {
    Article.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
