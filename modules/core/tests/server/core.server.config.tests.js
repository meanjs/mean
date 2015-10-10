'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  seed = require(path.resolve('./config/lib/seed'));

describe('Configuration Tests:', function () {

  describe('Testing default seedDB', function () {
    before(function(done) {
      User.remove(function(err) {
        should.not.exist(err);
        return done();
      });
    });

    after(function(done) {
      User.remove(function(err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should not be an admin user to begin with', function(done) {
      User.find({username: 'admin'}, function(err, users) {
        should.not.exist(err);
        users.should.be.instanceof(Array).and.have.lengthOf(0);
        return done();
      });
    });

    it('should not be a "regular" user to begin with', function(done) {
      User.find({username: 'user'}, function(err, users) {
        should.not.exist(err);
        users.should.be.instanceof(Array).and.have.lengthOf(0);
        return done();
      });
    });

    it('should set NODE_ENV to production and seedDB turned on so admin account must exist', function(done) {

      // Save original value
      var nodeEnv = process.env.NODE_ENV;
      // Set node env ro production environment
      process.env.NODE_ENV = 'production';

      User.find({username: 'admin'}, function(err, users) {

        // There shouldn't be any errors
        should.not.exist(err);
        users.should.be.instanceof(Array).and.have.lengthOf(0);

        seed.start().then(function() {
          User.find({username: 'admin'}, function(err, users) {
            should.not.exist(err);
            users.should.be.instanceof(Array).and.have.lengthOf(1);

            var admin = users.pop();
            admin.username.should.equal('admin');

            // Restore original NODE_ENV environment variable
            process.env.NODE_ENV = nodeEnv;

            User.remove(function(err) {
              should.not.exist(err);
              return done();
            });
          });
        });
      });
    });

    it('should set NODE_ENV to test and seedDB turned on so admin, and user accounts must exist', function(done) {

      // Save original value
      var nodeEnv = process.env.NODE_ENV;
      // Set node env ro production environment
      process.env.NODE_ENV = 'test';

      User.find({username: 'admin'}, function(err, users) {

        // There shouldn't be any errors
        should.not.exist(err);
        users.should.be.instanceof(Array).and.have.lengthOf(0);

        seed.start().then(function() {
          User.find({username: 'admin'}, function(err, users) {
            should.not.exist(err);
            users.should.be.instanceof(Array).and.have.lengthOf(1);

            var admin = users.pop();
            admin.username.should.equal('admin');

            User.find({username: 'user'}, function(err, users) {

              should.not.exist(err);
              users.should.be.instanceof(Array).and.have.lengthOf(1);

              var user = users.pop();
              user.username.should.equal('user');

              // Restore original NODE_ENV environment variable
              process.env.NODE_ENV = nodeEnv;

              User.remove(function(err) {
                should.not.exist(err);
                return done();
              });
            });
          });
        });
      });
    });
  });

  describe('Testing Session Secret Configuration', function () {
    it('should warn if using default session secret when running in production', function (done) {
      var conf = { sessionSecret: 'MEAN' };
      // set env to production for this test
      process.env.NODE_ENV = 'production';
      config.utils.validateSessionSecret(conf, true).should.equal(false);
      // set env back to test
      process.env.NODE_ENV = 'test';
      return done();
    });

    it('should accept non-default session secret when running in production', function (done) {
      var conf = { sessionSecret: 'super amazing secret' };
      // set env to production for this test
      process.env.NODE_ENV = 'production';
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      // set env back to test
      process.env.NODE_ENV = 'test';
      return done();
    });

    it('should accept default session secret when running in development', function (done) {
      var conf = { sessionSecret: 'MEAN' };
      // set env to development for this test
      process.env.NODE_ENV = 'development';
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      // set env back to test
      process.env.NODE_ENV = 'test';
      return done();
    });

    it('should accept default session secret when running in test', function (done) {
      var conf = { sessionSecret: 'MEAN' };
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      return done();
    });
  });
});
