'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Setting = mongoose.model('Setting'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  setting;

/**
 * Setting routes tests
 */
describe('Setting CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Setting
    user.save(function () {
      setting = {
        name: 'Setting name'
      };

      done();
    });
  });

  it('should be able to save a Setting if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Setting
        agent.post('/api/settings')
          .send(setting)
          .expect(200)
          .end(function (settingSaveErr, settingSaveRes) {
            // Handle Setting save error
            if (settingSaveErr) {
              return done(settingSaveErr);
            }

            // Get a list of Settings
            agent.get('/api/settings')
              .end(function (settingsGetErr, settingsGetRes) {
                // Handle Settings save error
                if (settingsGetErr) {
                  return done(settingsGetErr);
                }

                // Get Settings list
                var settings = settingsGetRes.body;

                // Set assertions
                (settings[0].user._id).should.equal(userId);
                (settings[0].name).should.match('Setting name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Setting if not logged in', function (done) {
    agent.post('/api/settings')
      .send(setting)
      .expect(403)
      .end(function (settingSaveErr, settingSaveRes) {
        // Call the assertion callback
        done(settingSaveErr);
      });
  });

  it('should not be able to save an Setting if no name is provided', function (done) {
    // Invalidate name field
    setting.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Setting
        agent.post('/api/settings')
          .send(setting)
          .expect(400)
          .end(function (settingSaveErr, settingSaveRes) {
            // Set message assertion
            (settingSaveRes.body.message).should.match('Please fill Setting name');

            // Handle Setting save error
            done(settingSaveErr);
          });
      });
  });

  it('should be able to update an Setting if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Setting
        agent.post('/api/settings')
          .send(setting)
          .expect(200)
          .end(function (settingSaveErr, settingSaveRes) {
            // Handle Setting save error
            if (settingSaveErr) {
              return done(settingSaveErr);
            }

            // Update Setting name
            setting.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Setting
            agent.put('/api/settings/' + settingSaveRes.body._id)
              .send(setting)
              .expect(200)
              .end(function (settingUpdateErr, settingUpdateRes) {
                // Handle Setting update error
                if (settingUpdateErr) {
                  return done(settingUpdateErr);
                }

                // Set assertions
                (settingUpdateRes.body._id).should.equal(settingSaveRes.body._id);
                (settingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Settings if not signed in', function (done) {
    // Create new Setting model instance
    var settingObj = new Setting(setting);

    // Save the setting
    settingObj.save(function () {
      // Request Settings
      request(app).get('/api/settings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Setting if not signed in', function (done) {
    // Create new Setting model instance
    var settingObj = new Setting(setting);

    // Save the Setting
    settingObj.save(function () {
      request(app).get('/api/settings/' + settingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', setting.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Setting with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/settings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Setting is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Setting which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Setting
    request(app).get('/api/settings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Setting with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Setting if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Setting
        agent.post('/api/settings')
          .send(setting)
          .expect(200)
          .end(function (settingSaveErr, settingSaveRes) {
            // Handle Setting save error
            if (settingSaveErr) {
              return done(settingSaveErr);
            }

            // Delete an existing Setting
            agent.delete('/api/settings/' + settingSaveRes.body._id)
              .send(setting)
              .expect(200)
              .end(function (settingDeleteErr, settingDeleteRes) {
                // Handle setting error error
                if (settingDeleteErr) {
                  return done(settingDeleteErr);
                }

                // Set assertions
                (settingDeleteRes.body._id).should.equal(settingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Setting if not signed in', function (done) {
    // Set Setting user
    setting.user = user;

    // Create new Setting model instance
    var settingObj = new Setting(setting);

    // Save the Setting
    settingObj.save(function () {
      // Try deleting Setting
      request(app).delete('/api/settings/' + settingObj._id)
        .expect(403)
        .end(function (settingDeleteErr, settingDeleteRes) {
          // Set message assertion
          (settingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Setting error error
          done(settingDeleteErr);
        });

    });
  });

  it('should be able to get a single Setting that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
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

          // Save a new Setting
          agent.post('/api/settings')
            .send(setting)
            .expect(200)
            .end(function (settingSaveErr, settingSaveRes) {
              // Handle Setting save error
              if (settingSaveErr) {
                return done(settingSaveErr);
              }

              // Set assertions on new Setting
              (settingSaveRes.body.name).should.equal(setting.name);
              should.exist(settingSaveRes.body.user);
              should.equal(settingSaveRes.body.user._id, orphanId);

              // force the Setting to have an orphaned user reference
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

                    // Get the Setting
                    agent.get('/api/settings/' + settingSaveRes.body._id)
                      .expect(200)
                      .end(function (settingInfoErr, settingInfoRes) {
                        // Handle Setting error
                        if (settingInfoErr) {
                          return done(settingInfoErr);
                        }

                        // Set assertions
                        (settingInfoRes.body._id).should.equal(settingSaveRes.body._id);
                        (settingInfoRes.body.name).should.equal(setting.name);
                        should.equal(settingInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Setting.remove().exec(done);
    });
  });
});
