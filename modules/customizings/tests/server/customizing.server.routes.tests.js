'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Customizing = mongoose.model('Customizing'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  customizing;

/**
 * Customizing routes tests
 */
describe('Customizing CRUD tests', function () {

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

    // Save a user to the test db and create new Customizing
    user.save(function () {
      customizing = {
        name: 'Customizing name'
      };

      done();
    });
  });

  it('should be able to save a Customizing if logged in', function (done) {
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

        // Save a new Customizing
        agent.post('/api/customizings')
          .send(customizing)
          .expect(200)
          .end(function (customizingSaveErr, customizingSaveRes) {
            // Handle Customizing save error
            if (customizingSaveErr) {
              return done(customizingSaveErr);
            }

            // Get a list of Customizings
            agent.get('/api/customizings')
              .end(function (customizingsGetErr, customizingsGetRes) {
                // Handle Customizings save error
                if (customizingsGetErr) {
                  return done(customizingsGetErr);
                }

                // Get Customizings list
                var customizings = customizingsGetRes.body;

                // Set assertions
                (customizings[0].user._id).should.equal(userId);
                (customizings[0].name).should.match('Customizing name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Customizing if not logged in', function (done) {
    agent.post('/api/customizings')
      .send(customizing)
      .expect(403)
      .end(function (customizingSaveErr, customizingSaveRes) {
        // Call the assertion callback
        done(customizingSaveErr);
      });
  });

  it('should not be able to save an Customizing if no name is provided', function (done) {
    // Invalidate name field
    customizing.name = '';

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

        // Save a new Customizing
        agent.post('/api/customizings')
          .send(customizing)
          .expect(400)
          .end(function (customizingSaveErr, customizingSaveRes) {
            // Set message assertion
            (customizingSaveRes.body.message).should.match('Please fill Customizing name');

            // Handle Customizing save error
            done(customizingSaveErr);
          });
      });
  });

  it('should be able to update an Customizing if signed in', function (done) {
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

        // Save a new Customizing
        agent.post('/api/customizings')
          .send(customizing)
          .expect(200)
          .end(function (customizingSaveErr, customizingSaveRes) {
            // Handle Customizing save error
            if (customizingSaveErr) {
              return done(customizingSaveErr);
            }

            // Update Customizing name
            customizing.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Customizing
            agent.put('/api/customizings/' + customizingSaveRes.body._id)
              .send(customizing)
              .expect(200)
              .end(function (customizingUpdateErr, customizingUpdateRes) {
                // Handle Customizing update error
                if (customizingUpdateErr) {
                  return done(customizingUpdateErr);
                }

                // Set assertions
                (customizingUpdateRes.body._id).should.equal(customizingSaveRes.body._id);
                (customizingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Customizings if not signed in', function (done) {
    // Create new Customizing model instance
    var customizingObj = new Customizing(customizing);

    // Save the customizing
    customizingObj.save(function () {
      // Request Customizings
      request(app).get('/api/customizings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Customizing if not signed in', function (done) {
    // Create new Customizing model instance
    var customizingObj = new Customizing(customizing);

    // Save the Customizing
    customizingObj.save(function () {
      request(app).get('/api/customizings/' + customizingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', customizing.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Customizing with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/customizings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Customizing is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Customizing which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Customizing
    request(app).get('/api/customizings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Customizing with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Customizing if signed in', function (done) {
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

        // Save a new Customizing
        agent.post('/api/customizings')
          .send(customizing)
          .expect(200)
          .end(function (customizingSaveErr, customizingSaveRes) {
            // Handle Customizing save error
            if (customizingSaveErr) {
              return done(customizingSaveErr);
            }

            // Delete an existing Customizing
            agent.delete('/api/customizings/' + customizingSaveRes.body._id)
              .send(customizing)
              .expect(200)
              .end(function (customizingDeleteErr, customizingDeleteRes) {
                // Handle customizing error error
                if (customizingDeleteErr) {
                  return done(customizingDeleteErr);
                }

                // Set assertions
                (customizingDeleteRes.body._id).should.equal(customizingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Customizing if not signed in', function (done) {
    // Set Customizing user
    customizing.user = user;

    // Create new Customizing model instance
    var customizingObj = new Customizing(customizing);

    // Save the Customizing
    customizingObj.save(function () {
      // Try deleting Customizing
      request(app).delete('/api/customizings/' + customizingObj._id)
        .expect(403)
        .end(function (customizingDeleteErr, customizingDeleteRes) {
          // Set message assertion
          (customizingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Customizing error error
          done(customizingDeleteErr);
        });

    });
  });

  it('should be able to get a single Customizing that has an orphaned user reference', function (done) {
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

          // Save a new Customizing
          agent.post('/api/customizings')
            .send(customizing)
            .expect(200)
            .end(function (customizingSaveErr, customizingSaveRes) {
              // Handle Customizing save error
              if (customizingSaveErr) {
                return done(customizingSaveErr);
              }

              // Set assertions on new Customizing
              (customizingSaveRes.body.name).should.equal(customizing.name);
              should.exist(customizingSaveRes.body.user);
              should.equal(customizingSaveRes.body.user._id, orphanId);

              // force the Customizing to have an orphaned user reference
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

                    // Get the Customizing
                    agent.get('/api/customizings/' + customizingSaveRes.body._id)
                      .expect(200)
                      .end(function (customizingInfoErr, customizingInfoRes) {
                        // Handle Customizing error
                        if (customizingInfoErr) {
                          return done(customizingInfoErr);
                        }

                        // Set assertions
                        (customizingInfoRes.body._id).should.equal(customizingSaveRes.body._id);
                        (customizingInfoRes.body.name).should.equal(customizing.name);
                        should.equal(customizingInfoRes.body.user, undefined);

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
      Customizing.remove().exec(done);
    });
  });
});
