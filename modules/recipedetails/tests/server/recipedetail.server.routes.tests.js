'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Recipedetail = mongoose.model('Recipedetail'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  recipedetail;

/**
 * Recipedetail routes tests
 */
describe('Recipedetail CRUD tests', function () {

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

    // Save a user to the test db and create new Recipedetail
    user.save(function () {
      recipedetail = {
        name: 'Recipedetail name'
      };

      done();
    });
  });

  it('should be able to save a Recipedetail if logged in', function (done) {
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

        // Save a new Recipedetail
        agent.post('/api/recipedetails')
          .send(recipedetail)
          .expect(200)
          .end(function (recipedetailSaveErr, recipedetailSaveRes) {
            // Handle Recipedetail save error
            if (recipedetailSaveErr) {
              return done(recipedetailSaveErr);
            }

            // Get a list of Recipedetails
            agent.get('/api/recipedetails')
              .end(function (recipedetailsGetErr, recipedetailsGetRes) {
                // Handle Recipedetails save error
                if (recipedetailsGetErr) {
                  return done(recipedetailsGetErr);
                }

                // Get Recipedetails list
                var recipedetails = recipedetailsGetRes.body;

                // Set assertions
                (recipedetails[0].user._id).should.equal(userId);
                (recipedetails[0].name).should.match('Recipedetail name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Recipedetail if not logged in', function (done) {
    agent.post('/api/recipedetails')
      .send(recipedetail)
      .expect(403)
      .end(function (recipedetailSaveErr, recipedetailSaveRes) {
        // Call the assertion callback
        done(recipedetailSaveErr);
      });
  });

  it('should not be able to save an Recipedetail if no name is provided', function (done) {
    // Invalidate name field
    recipedetail.name = '';

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

        // Save a new Recipedetail
        agent.post('/api/recipedetails')
          .send(recipedetail)
          .expect(400)
          .end(function (recipedetailSaveErr, recipedetailSaveRes) {
            // Set message assertion
            (recipedetailSaveRes.body.message).should.match('Please fill Recipedetail name');

            // Handle Recipedetail save error
            done(recipedetailSaveErr);
          });
      });
  });

  it('should be able to update an Recipedetail if signed in', function (done) {
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

        // Save a new Recipedetail
        agent.post('/api/recipedetails')
          .send(recipedetail)
          .expect(200)
          .end(function (recipedetailSaveErr, recipedetailSaveRes) {
            // Handle Recipedetail save error
            if (recipedetailSaveErr) {
              return done(recipedetailSaveErr);
            }

            // Update Recipedetail name
            recipedetail.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Recipedetail
            agent.put('/api/recipedetails/' + recipedetailSaveRes.body._id)
              .send(recipedetail)
              .expect(200)
              .end(function (recipedetailUpdateErr, recipedetailUpdateRes) {
                // Handle Recipedetail update error
                if (recipedetailUpdateErr) {
                  return done(recipedetailUpdateErr);
                }

                // Set assertions
                (recipedetailUpdateRes.body._id).should.equal(recipedetailSaveRes.body._id);
                (recipedetailUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Recipedetails if not signed in', function (done) {
    // Create new Recipedetail model instance
    var recipedetailObj = new Recipedetail(recipedetail);

    // Save the recipedetail
    recipedetailObj.save(function () {
      // Request Recipedetails
      request(app).get('/api/recipedetails')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Recipedetail if not signed in', function (done) {
    // Create new Recipedetail model instance
    var recipedetailObj = new Recipedetail(recipedetail);

    // Save the Recipedetail
    recipedetailObj.save(function () {
      request(app).get('/api/recipedetails/' + recipedetailObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', recipedetail.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Recipedetail with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/recipedetails/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Recipedetail is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Recipedetail which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Recipedetail
    request(app).get('/api/recipedetails/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Recipedetail with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Recipedetail if signed in', function (done) {
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

        // Save a new Recipedetail
        agent.post('/api/recipedetails')
          .send(recipedetail)
          .expect(200)
          .end(function (recipedetailSaveErr, recipedetailSaveRes) {
            // Handle Recipedetail save error
            if (recipedetailSaveErr) {
              return done(recipedetailSaveErr);
            }

            // Delete an existing Recipedetail
            agent.delete('/api/recipedetails/' + recipedetailSaveRes.body._id)
              .send(recipedetail)
              .expect(200)
              .end(function (recipedetailDeleteErr, recipedetailDeleteRes) {
                // Handle recipedetail error error
                if (recipedetailDeleteErr) {
                  return done(recipedetailDeleteErr);
                }

                // Set assertions
                (recipedetailDeleteRes.body._id).should.equal(recipedetailSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Recipedetail if not signed in', function (done) {
    // Set Recipedetail user
    recipedetail.user = user;

    // Create new Recipedetail model instance
    var recipedetailObj = new Recipedetail(recipedetail);

    // Save the Recipedetail
    recipedetailObj.save(function () {
      // Try deleting Recipedetail
      request(app).delete('/api/recipedetails/' + recipedetailObj._id)
        .expect(403)
        .end(function (recipedetailDeleteErr, recipedetailDeleteRes) {
          // Set message assertion
          (recipedetailDeleteRes.body.message).should.match('User is not authorized');

          // Handle Recipedetail error error
          done(recipedetailDeleteErr);
        });

    });
  });

  it('should be able to get a single Recipedetail that has an orphaned user reference', function (done) {
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

          // Save a new Recipedetail
          agent.post('/api/recipedetails')
            .send(recipedetail)
            .expect(200)
            .end(function (recipedetailSaveErr, recipedetailSaveRes) {
              // Handle Recipedetail save error
              if (recipedetailSaveErr) {
                return done(recipedetailSaveErr);
              }

              // Set assertions on new Recipedetail
              (recipedetailSaveRes.body.name).should.equal(recipedetail.name);
              should.exist(recipedetailSaveRes.body.user);
              should.equal(recipedetailSaveRes.body.user._id, orphanId);

              // force the Recipedetail to have an orphaned user reference
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

                    // Get the Recipedetail
                    agent.get('/api/recipedetails/' + recipedetailSaveRes.body._id)
                      .expect(200)
                      .end(function (recipedetailInfoErr, recipedetailInfoRes) {
                        // Handle Recipedetail error
                        if (recipedetailInfoErr) {
                          return done(recipedetailInfoErr);
                        }

                        // Set assertions
                        (recipedetailInfoRes.body._id).should.equal(recipedetailSaveRes.body._id);
                        (recipedetailInfoRes.body.name).should.equal(recipedetail.name);
                        should.equal(recipedetailInfoRes.body.user, undefined);

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
      Recipedetail.remove().exec(done);
    });
  });
});
