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

/**
 * Globals
 */
var user1, admin1, userFromSeedConfig, adminFromSeedConfig;

describe('Configuration Tests:', function () {

  describe('Testing default seedDB', function () {
    before(function(done) {
      User.remove(function(err) {
        should.not.exist(err);

        user1 = {
          username: 'user_config_test',
          provider: 'local',
          email: 'user_config_test_@localhost.com',
          firstName: 'User',
          lastName: 'Local',
          displayName: 'User Local',
          roles: ['user']
        };

        admin1 = {
          username: 'admin_config_test',
          provider: 'local',
          email: 'admin_config_test_@localhost.com',
          firstName: 'Admin',
          lastName: 'Local',
          displayName: 'Admin Local',
          roles: ['user', 'admin']
        };

        userFromSeedConfig = config.seedDB.options.seedUser;
        adminFromSeedConfig = config.seedDB.options.seedAdmin;

        return done();

      });
    });

    after(function(done) {
      User.remove(function(err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should have seedDB configuration set for "regular" user', function() {
      (typeof userFromSeedConfig).should.not.equal('undefined');
      should.exist(userFromSeedConfig.username);
      should.exist(userFromSeedConfig.email);
    });

    it('should have seedDB configuration set for admin user', function() {
      (typeof adminFromSeedConfig).should.not.equal('undefined');
      should.exist(adminFromSeedConfig.username);
      should.exist(adminFromSeedConfig.email);
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

    it('should seed ONLY the admin user account when NODE_ENV is set to "production"', function(done) {

      // Save original value
      var nodeEnv = process.env.NODE_ENV;
      // Set node env ro production environment
      process.env.NODE_ENV = 'production';

      User.find({username: adminFromSeedConfig.username}, function(err, users) {

        // There shouldn't be any errors
        should.not.exist(err);
        users.should.be.instanceof(Array).and.have.lengthOf(0);

        seed
          .start({ logResults: false })
          .then(function() {
            User.find({username: adminFromSeedConfig.username}, function(err, users) {
              should.not.exist(err);
              users.should.be.instanceof(Array).and.have.lengthOf(1);

              var _admin = users.pop();
              _admin.username.should.equal(adminFromSeedConfig.username);

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

    it('should seed admin, and "regular" user accounts when NODE_ENV is set to "test"', function(done) {

      // Save original value
      var nodeEnv = process.env.NODE_ENV;
      // Set node env ro production environment
      process.env.NODE_ENV = 'test';

      User.find({username: adminFromSeedConfig.username}, function(err, users) {

        // There shouldn't be any errors
        should.not.exist(err);
        users.should.be.instanceof(Array).and.have.lengthOf(0);

        seed
          .start({ logResults: false })
          .then(function() {
            User.find({username: adminFromSeedConfig.username}, function(err, users) {
              should.not.exist(err);
              users.should.be.instanceof(Array).and.have.lengthOf(1);

              var _admin = users.pop();
              _admin.username.should.equal(adminFromSeedConfig.username);

              User.find({username: userFromSeedConfig.username}, function(err, users) {

                should.not.exist(err);
                users.should.be.instanceof(Array).and.have.lengthOf(1);

                var _user = users.pop();
                _user.username.should.equal(userFromSeedConfig.username);

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

    it('should seed admin, and "regular" user accounts when NODE_ENV is set to "test" when they already exist', function (done) {

      // Save original value
      var nodeEnv = process.env.NODE_ENV;
      // Set node env ro production environment
      process.env.NODE_ENV = 'test';

      var _user = new User(userFromSeedConfig);
      var _admin = new User(adminFromSeedConfig);

      _admin.save(function (err) {
        // There shouldn't be any errors
        should.not.exist(err);
        _user.save(function (err) {
          // There shouldn't be any errors
          should.not.exist(err);

          User.find({ username: { $in: [adminFromSeedConfig.username, userFromSeedConfig.username] } }, function (err, users) {

            // There shouldn't be any errors
            should.not.exist(err);
            users.should.be.instanceof(Array).and.have.lengthOf(2);

            seed
              .start({ logResults: false })
              .then(function () {
                User.find({ username: { $in: [adminFromSeedConfig.username, userFromSeedConfig.username] } }, function (err, users) {
                  should.not.exist(err);
                  users.should.be.instanceof(Array).and.have.lengthOf(2);

                  // Restore original NODE_ENV environment variable
                  process.env.NODE_ENV = nodeEnv;

                  User.remove(function (err) {
                    should.not.exist(err);
                    return done();
                  });
                });
              });
          });
        });
      });
    });

    it('should ONLY seed admin user account when NODE_ENV is set to "production" with custom admin', function(done) {

      // Save original value
      var nodeEnv = process.env.NODE_ENV;
      // Set node env ro production environment
      process.env.NODE_ENV = 'production';

      User.find({username: admin1.username}, function(err, users) {

        // There shouldn't be any errors
        should.not.exist(err);
        users.should.be.instanceof(Array).and.have.lengthOf(0);

        seed
          .start({ logResults: false, seedAdmin: admin1 })
          .then(function() {
            User.find({username: admin1.username}, function(err, users) {
              should.not.exist(err);
              users.should.be.instanceof(Array).and.have.lengthOf(1);

              var _admin = users.pop();
              _admin.username.should.equal(admin1.username);

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

    it('should seed admin, and "regular" user accounts when NODE_ENV is set to "test" with custom options', function(done) {

      // Save original value
      var nodeEnv = process.env.NODE_ENV;
      // Set node env ro production environment
      process.env.NODE_ENV = 'test';

      User.find({username: admin1.username}, function(err, users) {

        // There shouldn't be any errors
        should.not.exist(err);
        users.should.be.instanceof(Array).and.have.lengthOf(0);

        seed
          .start({ logResults: false, seedAdmin: admin1, seedUser: user1 })
          .then(function() {
            User.find({username: admin1.username}, function(err, users) {
              should.not.exist(err);
              users.should.be.instanceof(Array).and.have.lengthOf(1);

              var _admin = users.pop();
              _admin.username.should.equal(admin1.username);

              User.find({username: user1.username}, function(err, users) {

                should.not.exist(err);
                users.should.be.instanceof(Array).and.have.lengthOf(1);

                var _user = users.pop();
                _user.username.should.equal(user1.username);

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

    it('should NOT seed admin user account if it already exists when NODE_ENV is set to "production"', function(done) {

      // Save original value
      var nodeEnv = process.env.NODE_ENV;
      // Set node env ro production environment
      process.env.NODE_ENV = 'production';

      var _admin = new User(adminFromSeedConfig);

      _admin.save(function(err, user) {
        // There shouldn't be any errors
        should.not.exist(err);
        user.username.should.equal(adminFromSeedConfig.username);

        seed
          .start({ logResults: false })
          .then(function () {
            // we don't ever expect to make it here but we don't want to timeout          
            User.remove(function(err) {
              should.not.exist(err);
              // force this test to fail since we should never be here
              should.exist(undefined);
              // Restore original NODE_ENV environment variable
              process.env.NODE_ENV = nodeEnv;

              return done();
            });
          })
          .catch(function (err) {
            should.exist(err);
            err.message.should.equal('Failed due to local account already exists: ' + adminFromSeedConfig.username);

            // Restore original NODE_ENV environment variable
            process.env.NODE_ENV = nodeEnv;

            User.remove(function(removeErr) {
              should.not.exist(removeErr);

              return done();
            });
          });
      });
    });

    it('should NOT seed "regular" user account if missing email when NODE_ENV set to "test"', function (done) {

      // Save original value
      var nodeEnv = process.env.NODE_ENV;
      // Set node env ro test environment
      process.env.NODE_ENV = 'test';

      var _user = new User(user1);
      _user.email = '';

      seed
        .start({ logResults: false, seedUser: _user })
        .then(function () {
          // we don't ever expect to make it here but we don't want to timeout
          User.remove(function(err) {
            // force this test to fail since we should never be here
            should.exist(undefined);
            // Restore original NODE_ENV environment variable
            process.env.NODE_ENV = nodeEnv;

            return done();
          });
        })
        .catch(function (err) {
          should.exist(err);
          err.message.should.equal('Failed to add local ' + user1.username);

          // Restore original NODE_ENV environment variable
          process.env.NODE_ENV = nodeEnv;

          User.remove(function(removeErr) {
            should.not.exist(removeErr);

            return done();
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

    it('should accept non-default session secret when running in production', function () {
      var conf = { sessionSecret: 'super amazing secret' };
      // set env to production for this test
      process.env.NODE_ENV = 'production';
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      // set env back to test
      process.env.NODE_ENV = 'test';
    });

    it('should accept default session secret when running in development', function () {
      var conf = { sessionSecret: 'MEAN' };
      // set env to development for this test
      process.env.NODE_ENV = 'development';
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      // set env back to test
      process.env.NODE_ENV = 'test';
    });

    it('should accept default session secret when running in test', function () {
      var conf = { sessionSecret: 'MEAN' };
      config.utils.validateSessionSecret(conf, true).should.equal(true);
    });
  });
});
