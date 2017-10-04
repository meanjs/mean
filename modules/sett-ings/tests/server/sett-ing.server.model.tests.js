'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  SettIng = mongoose.model('SettIng');

/**
 * Globals
 */
var user,
  settIng;

/**
 * Unit tests
 */
describe('Sett ing Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      settIng = new SettIng({
        name: 'Sett ing Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return settIng.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      settIng.name = '';

      return settIng.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    SettIng.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
