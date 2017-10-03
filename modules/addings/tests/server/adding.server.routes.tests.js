'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adding = mongoose.model('Adding'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  adding;

/**
 * Adding routes tests
 */
describe('Adding CRUD tests', function () {

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

    // Save a user to the test db and create new Adding
    user.save(function () {
      adding = {
        name: 'Adding name'
      };

      done();
    });
  });

  it('should be able to save a Adding if logged in', function (done) {
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

        // Save a new Adding
        agent.post('/api/addings')
          .send(adding)
          .expect(200)
          .end(function (addingSaveErr, addingSaveRes) {
            // Handle Adding save error
            if (addingSaveErr) {
              return done(addingSaveErr);
            }

            // Get a list of Addings
            agent.get('/api/addings')
              .end(function (addingsGetErr, addingsGetRes) {
                // Handle Addings save error
                if (addingsGetErr) {
                  return done(addingsGetErr);
                }

                // Get Addings list
                var addings = addingsGetRes.body;

                // Set assertions
                (addings[0].user._id).should.equal(userId);
                (addings[0].name).should.match('Adding name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Adding if not logged in', function (done) {
    agent.post('/api/addings')
      .send(adding)
      .expect(403)
      .end(function (addingSaveErr, addingSaveRes) {
        // Call the assertion callback
        done(addingSaveErr);
      });
  });

  it('should not be able to save an Adding if no name is provided', function (done) {
    // Invalidate name field
    adding.name = '';

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

        // Save a new Adding
        agent.post('/api/addings')
          .send(adding)
          .expect(400)
          .end(function (addingSaveErr, addingSaveRes) {
            // Set message assertion
            (addingSaveRes.body.message).should.match('Please fill Adding name');

            // Handle Adding save error
            done(addingSaveErr);
          });
      });
  });

  it('should be able to update an Adding if signed in', function (done) {
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

        // Save a new Adding
        agent.post('/api/addings')
          .send(adding)
          .expect(200)
          .end(function (addingSaveErr, addingSaveRes) {
            // Handle Adding save error
            if (addingSaveErr) {
              return done(addingSaveErr);
            }

            // Update Adding name
            adding.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Adding
            agent.put('/api/addings/' + addingSaveRes.body._id)
              .send(adding)
              .expect(200)
              .end(function (addingUpdateErr, addingUpdateRes) {
                // Handle Adding update error
                if (addingUpdateErr) {
                  return done(addingUpdateErr);
                }

                // Set assertions
                (addingUpdateRes.body._id).should.equal(addingSaveRes.body._id);
                (addingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Addings if not signed in', function (done) {
    // Create new Adding model instance
    var addingObj = new Adding(adding);

    // Save the adding
    addingObj.save(function () {
      // Request Addings
      request(app).get('/api/addings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Adding if not signed in', function (done) {
    // Create new Adding model instance
    var addingObj = new Adding(adding);

    // Save the Adding
    addingObj.save(function () {
      request(app).get('/api/addings/' + addingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', adding.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Adding with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/addings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adding is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Adding which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Adding
    request(app).get('/api/addings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Adding with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Adding if signed in', function (done) {
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

        // Save a new Adding
        agent.post('/api/addings')
          .send(adding)
          .expect(200)
          .end(function (addingSaveErr, addingSaveRes) {
            // Handle Adding save error
            if (addingSaveErr) {
              return done(addingSaveErr);
            }

            // Delete an existing Adding
            agent.delete('/api/addings/' + addingSaveRes.body._id)
              .send(adding)
              .expect(200)
              .end(function (addingDeleteErr, addingDeleteRes) {
                // Handle adding error error
                if (addingDeleteErr) {
                  return done(addingDeleteErr);
                }

                // Set assertions
                (addingDeleteRes.body._id).should.equal(addingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Adding if not signed in', function (done) {
    // Set Adding user
    adding.user = user;

    // Create new Adding model instance
    var addingObj = new Adding(adding);

    // Save the Adding
    addingObj.save(function () {
      // Try deleting Adding
      request(app).delete('/api/addings/' + addingObj._id)
        .expect(403)
        .end(function (addingDeleteErr, addingDeleteRes) {
          // Set message assertion
          (addingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Adding error error
          done(addingDeleteErr);
        });

    });
  });

  it('should be able to get a single Adding that has an orphaned user reference', function (done) {
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

          // Save a new Adding
          agent.post('/api/addings')
            .send(adding)
            .expect(200)
            .end(function (addingSaveErr, addingSaveRes) {
              // Handle Adding save error
              if (addingSaveErr) {
                return done(addingSaveErr);
              }

              // Set assertions on new Adding
              (addingSaveRes.body.name).should.equal(adding.name);
              should.exist(addingSaveRes.body.user);
              should.equal(addingSaveRes.body.user._id, orphanId);

              // force the Adding to have an orphaned user reference
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

                    // Get the Adding
                    agent.get('/api/addings/' + addingSaveRes.body._id)
                      .expect(200)
                      .end(function (addingInfoErr, addingInfoRes) {
                        // Handle Adding error
                        if (addingInfoErr) {
                          return done(addingInfoErr);
                        }

                        // Set assertions
                        (addingInfoRes.body._id).should.equal(addingSaveRes.body._id);
                        (addingInfoRes.body.name).should.equal(adding.name);
                        should.equal(addingInfoRes.body.user, undefined);

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
      Adding.remove().exec(done);
    });
  });
});
