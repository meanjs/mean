/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article');

/**
 * Globals
 */
var user,
  article;

/**
 * Unit tests
 */
describe('Article Model Unit Tests:', () => {

  beforeEach(done => {
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
      .then(() => {
        article = new Article({
          title: 'Article Title',
          content: 'Article Content',
          user
        });

        done();
      })
      .catch(done);
  });

  describe('Method Save', () => {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      article.save(err => {
        should.not.exist(err);
        return done();
      });
    });

    it('should be able to show an error when try to save without title', done => {
      article.title = '';

      article.save(err => {
        should.exist(err);
        return done();
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
