'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  path = require('path'),
  mongooseService = require(path.resolve('./config/lib/mongoose.js'));

/**
 * Globals
 */
var user,
  article,
  User,
  Article;

/**
 * Unit tests
 */
describe('Article Model Unit Tests:', function () {
  before(function() {
    mongooseService.loadModels(function () {
      User = mongoose.model('User');
      Article = mongoose.model('Article');
    });
  });

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
      provider: 'local'
    });

    user.save()
      .then(function () {
        article = new Article({
          title: 'Article Title',
          content: 'Article Content',
          user: user
        });

        done();
      })
      .catch(done);
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      article.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      article.title = '';

      article.save(function (err) {
        should.exist(err);
        return done();
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
