'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Globals
 */
var user, user2, user3;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function () {
  before(function (done) {
    user = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local'
    };
    user2 = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local'
    };
    user3 = {
      firstName: 'Different',
      lastName: 'User',
      displayName: 'Full Different Name',
      email: 'test3@test.com',
      username: 'different_username',
      password: 'different_password',
      provider: 'local'
    };

    done();
  });

  describe('Method Save', function () {
    it('should begin with no users', function (done) {
      User.find({}, function (err, users) {
        users.should.have.length(0);
        done();
      });
    });

    it('should be able to save without problems', function (done) {
      var _user = new User(user);
      
      _user.save(function (err) {
        should.not.exist(err);
        _user.remove(function (err) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('should fail to save an existing user again', function (done) {
      var _user = new User(user);
      var _user2 = new User(user2);

      _user.save(function () {
        _user2.save(function (err) {
          should.exist(err);
          _user.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when try to save without first name', function (done) {
      var _user = new User(user);

      _user.firstName = '';
      _user.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should confirm that saving user model doesnt change the password', function (done) {
      var _user = new User(user);

      _user.save(function (err) {
        should.not.exist(err);
        var passwordBefore = _user.password;
        _user.firstName = 'test';
        _user.save(function (err) {
          var passwordAfter = _user.password;
          passwordBefore.should.equal(passwordAfter);
          _user.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to save 2 different users', function (done) {
      var _user = new User(user);
      var _user3 = new User(user3);

      _user.save(function (err) {
        should.not.exist(err);
        _user3.save(function (err) {
          should.not.exist(err);
          _user3.remove(function (err) {
            should.not.exist(err);
            _user.remove(function (err) {
              should.not.exist(err);
              done();
            });
          });
        });
      });
    });

    it('should not be able to save different user with the same email address', function (done) {
      var _user = new User(user);
      var _user3 = new User(user3);

      _user.remove(function (err) {
        should.not.exist(err);
        _user.save(function (err) {
          var user3_email = _user3.email;
          _user3.email = _user.email;
          _user3.save(function (err) {
            should.exist(err);
            // Restoring the original email for test3 so it can be used in later tests
            _user3.email = user3_email;
            done();
          });
        });
      });

    });

  });

  after(function (done) {
    User.remove().exec(done);
  });
});
