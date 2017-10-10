'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Profile = mongoose.model('Profile'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  profile;

/**
 * Profile routes tests
 */
describe('Profile CRUD tests', function () {

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

    // Save a user to the test db and create new Profile
    user.save(function () {
      profile = {
        name: 'Profile name'
      };

      done();
    });
  });

  it('should be able to save a Profile if logged in', function (done) {
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

        // Save a new Profile
        agent.post('/api/profiles')
          .send(profile)
          .expect(200)
          .end(function (profileSaveErr, profileSaveRes) {
            // Handle Profile save error
            if (profileSaveErr) {
              return done(profileSaveErr);
            }

            // Get a list of Profiles
            agent.get('/api/profiles')
              .end(function (profilesGetErr, profilesGetRes) {
                // Handle Profiles save error
                if (profilesGetErr) {
                  return done(profilesGetErr);
                }

                // Get Profiles list
                var profiles = profilesGetRes.body;

                // Set assertions
                (profiles[0].user._id).should.equal(userId);
                (profiles[0].name).should.match('Profile name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Profile if not logged in', function (done) {
    agent.post('/api/profiles')
      .send(profile)
      .expect(403)
      .end(function (profileSaveErr, profileSaveRes) {
        // Call the assertion callback
        done(profileSaveErr);
      });
  });

  it('should not be able to save an Profile if no name is provided', function (done) {
    // Invalidate name field
    profile.name = '';

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

        // Save a new Profile
        agent.post('/api/profiles')
          .send(profile)
          .expect(400)
          .end(function (profileSaveErr, profileSaveRes) {
            // Set message assertion
            (profileSaveRes.body.message).should.match('Please fill Profile name');

            // Handle Profile save error
            done(profileSaveErr);
          });
      });
  });

  it('should be able to update an Profile if signed in', function (done) {
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

        // Save a new Profile
        agent.post('/api/profiles')
          .send(profile)
          .expect(200)
          .end(function (profileSaveErr, profileSaveRes) {
            // Handle Profile save error
            if (profileSaveErr) {
              return done(profileSaveErr);
            }

            // Update Profile name
            profile.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Profile
            agent.put('/api/profiles/' + profileSaveRes.body._id)
              .send(profile)
              .expect(200)
              .end(function (profileUpdateErr, profileUpdateRes) {
                // Handle Profile update error
                if (profileUpdateErr) {
                  return done(profileUpdateErr);
                }

                // Set assertions
                (profileUpdateRes.body._id).should.equal(profileSaveRes.body._id);
                (profileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Profiles if not signed in', function (done) {
    // Create new Profile model instance
    var profileObj = new Profile(profile);

    // Save the profile
    profileObj.save(function () {
      // Request Profiles
      request(app).get('/api/profiles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Profile if not signed in', function (done) {
    // Create new Profile model instance
    var profileObj = new Profile(profile);

    // Save the Profile
    profileObj.save(function () {
      request(app).get('/api/profiles/' + profileObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', profile.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Profile with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/profiles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Profile is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Profile which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Profile
    request(app).get('/api/profiles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Profile with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Profile if signed in', function (done) {
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

        // Save a new Profile
        agent.post('/api/profiles')
          .send(profile)
          .expect(200)
          .end(function (profileSaveErr, profileSaveRes) {
            // Handle Profile save error
            if (profileSaveErr) {
              return done(profileSaveErr);
            }

            // Delete an existing Profile
            agent.delete('/api/profiles/' + profileSaveRes.body._id)
              .send(profile)
              .expect(200)
              .end(function (profileDeleteErr, profileDeleteRes) {
                // Handle profile error error
                if (profileDeleteErr) {
                  return done(profileDeleteErr);
                }

                // Set assertions
                (profileDeleteRes.body._id).should.equal(profileSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Profile if not signed in', function (done) {
    // Set Profile user
    profile.user = user;

    // Create new Profile model instance
    var profileObj = new Profile(profile);

    // Save the Profile
    profileObj.save(function () {
      // Try deleting Profile
      request(app).delete('/api/profiles/' + profileObj._id)
        .expect(403)
        .end(function (profileDeleteErr, profileDeleteRes) {
          // Set message assertion
          (profileDeleteRes.body.message).should.match('User is not authorized');

          // Handle Profile error error
          done(profileDeleteErr);
        });

    });
  });

  it('should be able to get a single Profile that has an orphaned user reference', function (done) {
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

          // Save a new Profile
          agent.post('/api/profiles')
            .send(profile)
            .expect(200)
            .end(function (profileSaveErr, profileSaveRes) {
              // Handle Profile save error
              if (profileSaveErr) {
                return done(profileSaveErr);
              }

              // Set assertions on new Profile
              (profileSaveRes.body.name).should.equal(profile.name);
              should.exist(profileSaveRes.body.user);
              should.equal(profileSaveRes.body.user._id, orphanId);

              // force the Profile to have an orphaned user reference
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

                    // Get the Profile
                    agent.get('/api/profiles/' + profileSaveRes.body._id)
                      .expect(200)
                      .end(function (profileInfoErr, profileInfoRes) {
                        // Handle Profile error
                        if (profileInfoErr) {
                          return done(profileInfoErr);
                        }

                        // Set assertions
                        (profileInfoRes.body._id).should.equal(profileSaveRes.body._id);
                        (profileInfoRes.body.name).should.equal(profile.name);
                        should.equal(profileInfoRes.body.user, undefined);

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
      Profile.remove().exec(done);
    });
  });
});
