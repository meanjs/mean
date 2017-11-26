'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Item = mongoose.model('Item'),
  Category = mongoose.model('Category'),
  Module = mongoose.model('Module');

/**
 * Globals
 */
var user,
  item,
  category,
  module;

/**
 * Unit tests
 */
describe('Item/Category/Module Model Unit Tests:', function () {

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
        item = new Item({
          title: 'Item Title',
          content: 'Item Content',
          user: user
        })
        category = new Category({
        title: 'Category Title'
        })
        module = new Module({
        title: 'Module Title'
        });
        done();
      })
      .catch(done);

  });

  describe('Method Save', function () {
    it('should be able to save item without problems', function (done) {
      this.timeout(10000);
      item.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should be able to show an error when try to save item without title', function (done) {
      item.title = '';

      item.save(function (err) {
        should.exist(err);
        return done();
      });
    });
    it('should be able to save category without problems', function (done) {
      this.timeout(10000);
      category.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });
    it('should be able to show an error when try to save category without title', function (done) {
      category.title = '';

      category.save(function (err) {
        should.exist(err);
        return done();
      });
    });
  it('should be able to save module without problems', function (done) {
      this.timeout(10000);
      item.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });
  it('should be able to show an error when try to save module without title', function (done) {
      module.title = '';

      module.save(function (err) {
        should.exist(err);
        return done();
      });
    });
  });
  

  afterEach(function (done) {
    Item.remove().exec()
      .then(Module.remove().exec())
      .then(Category.remove().exec())
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
