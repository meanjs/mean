'use strict';

var should = require('should'),
  request = require('supertest'),
  app = require('../../server'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article'),
  // note: the agent allows us to preserve a session and cookies for the logged in user
  agent = request.agent(app);


/**
 * Globals
 */
var user, article;

describe('Article CRUD tests', function () {

  beforeEach(function(done) {
    // saves a user to the test db.
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local'
    });
    user.save();

    article = new Article({
      title: 'Article Title',
      content: 'Article Content',
      user: user
    });

    done();
  });

  // ------------ CREATE (SAVE) operations ------------
  it('should be able to save an article if logged in', function (done) {
    agent
      .post('/auth/signin')
      .send(user)
      .end(function (err, res){
        var userId = res.body._id;
        agent
          .post('/articles')
          .send(article)
          .expect(200)
          .end(function (err, res) {
            agent
              .get('/articles')
              .end(function(error, res) {
                (res.body[0].user._id).should.equal(userId);
                (res.body[0].title).should.match('Article Title');
                done();
              });
            });
        });
  });


  it('should not be able to save an article if not logged in', function (done) {
    agent
      .post('/articles')
      .send(article)
      .expect(200)
      .end(function (err, res) {
        should.exist(err);
        (res.status).should.equal(401);
        (res.unauthorized).should.equal(true);
        done();
      });
  });

  it('should not be able to save an article if no title is provided', function (done) {
    article.title = '';
    agent
      .post('/auth/signin')
      .send(user)
      .end(function (err, res){
        agent
          .post('/articles')
          .send(article)
          .expect(200)
          .end(function (err, res) {
            should.exist(err);
            (res.body.message).should.match('Title cannot be blank');
            done();
          });
      });
  });


  // ------------ PUT (UPDATE) operations ------------
  it('should be able to update an article if signed in', function(done){
    agent
      .post('/auth/signin')
      .send(user)
      .end(function (err, res){
        var userId = res.body._id;
        agent
          .post('/articles')
          .send(article)
          .expect(200)
          .end(function (err, res) {
            agent
              .get('/articles')
              .end(function(error, res) {
                (res.body[0].user._id).should.equal(userId);
                (res.body[0].title).should.match('Article Title');
                var article_Id = res.body[0]._id;
                article.title = 'WHY YOU GOTTA BE SO MEAN?';
                agent
                  .put('/articles/' + article_Id)
                  .send(article)
                  .end(function (err, res) {
                    (res.body._id).should.equal(article_Id);
                    (res.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');
                    done();
                  });
              });
            });
        });
  });

  // ------------ READ operations ------------
  it('should be able to get a list of articles if not signed in', function (done) {
    // Adding 10 articles to the db
    var numArticles = 10;
    while (numArticles--) {
      var article = new Article({
        title: numArticles + ' Another Article Title',
        content: numArticles + ' Another Article Content',
        user: user
      });
      article.save();
    }

    // note there is no need to use the supertest agent here as we do not need to be signed in
    request(app)
      .get('/articles')
      .end(function (req, res) {
        (res.body[0].title).should.match('0 Another Article Title');
        done();
      });

  });


  it('should be able to get a single article if not signed in', function (done) {
    var article = new Article({
        title: 'Another Article Title',
        content: 'Another Article Content',
        user: user
      });
    article.save();

    request(app)
      .get('/articles/' + article._id)
      .end(function (req, res) {
        (res.body.title).should.match('Another Article Title');
        done();
      });

  });

  // ------------ DELETE operations ------------
  it('should be able to delete an article if signed in', function (done) {
    var article = new Article({
        title: 'Another Article Title',
        content: 'Another Article Content',
        user: user
      });
    article.save();

    agent
      .post('/auth/signin')
      .send(user)
      .end(function (err, res) {
        (err === null).should.equal(true);
        agent
          .delete('/articles/' + article._id)
          .end(function (err, res) {
            (res.req.method).should.match('DELETE');
            (res.body.title).should.match('Another Article Title');
            done();
          });
      });
  });

  it('should not be able to delete an article if not signed in', function (done) {
    var article = new Article({
        title: 'Another Article Title',
        content: 'Another Article Content',
        user: user
      });
    article.save();

    request(app)
      .delete('/articles/' + article._id)
      .end(function (err, res) {
        (res.req.method).should.match('DELETE');
        (res.status).should.equal(401);
        (res.unauthorized).should.equal(true);
        done();
      });
  });

  afterEach(function(done) {
    User.remove().exec();
    Article.remove().exec();
    done();
  });

});