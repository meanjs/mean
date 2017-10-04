'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  SettIng = mongoose.model('SettIng'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  settIng;

/**
 * Sett ing routes tests
 */
describe('Sett ing CRUD tests', function () {

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

    // Save a user to the test db and create new Sett ing
    user.save(function () {
      settIng = {
        name: 'Sett ing name'
      };

      done();
    });
  });

  it('should be able to save a Sett ing if logged in', function (done) {
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

        // Save a new Sett ing
        agent.post('/api/settIngs')
          .send(settIng)
          .expect(200)
          .end(function (settIngSaveErr, settIngSaveRes) {
            // Handle Sett ing save error
            if (settIngSaveErr) {
              return done(settIngSaveErr);
            }

            // Get a list of Sett ings
            agent.get('/api/settIngs')
              .end(function (settIngsGetErr, settIngsGetRes) {
                // Handle Sett ings save error
                if (settIngsGetErr) {
                  return done(settIngsGetErr);
                }

                // Get Sett ings list
                var settIngs = settIngsGetRes.body;

                // Set assertions
                (settIngs[0].user._id).should.equal(userId);
                (settIngs[0].name).should.match('Sett ing name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sett ing if not logged in', function (done) {
    agent.post('/api/settIngs')
      .send(settIng)
      .expect(403)
      .end(function (settIngSaveErr, settIngSaveRes) {
        // Call the assertion callback
        done(settIngSaveErr);
      });
  });

  it('should not be able to save an Sett ing if no name is provided', function (done) {
    // Invalidate name field
    settIng.name = '';

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

        // Save a new Sett ing
        agent.post('/api/settIngs')
          .send(settIng)
          .expect(400)
          .end(function (settIngSaveErr, settIngSaveRes) {
            // Set message assertion
            (settIngSaveRes.body.message).should.match('Please fill Sett ing name');

            // Handle Sett ing save error
            done(settIngSaveErr);
          });
      });
  });

  it('should be able to update an Sett ing if signed in', function (done) {
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

        // Save a new Sett ing
        agent.post('/api/settIngs')
          .send(settIng)
          .expect(200)
          .end(function (settIngSaveErr, settIngSaveRes) {
            // Handle Sett ing save error
            if (settIngSaveErr) {
              return done(settIngSaveErr);
            }

            // Update Sett ing name
            settIng.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sett ing
            agent.put('/api/settIngs/' + settIngSaveRes.body._id)
              .send(settIng)
              .expect(200)
              .end(function (settIngUpdateErr, settIngUpdateRes) {
                // Handle Sett ing update error
                if (settIngUpdateErr) {
                  return done(settIngUpdateErr);
                }

                // Set assertions
                (settIngUpdateRes.body._id).should.equal(settIngSaveRes.body._id);
                (settIngUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sett ings if not signed in', function (done) {
    // Create new Sett ing model instance
    var settIngObj = new SettIng(settIng);

    // Save the settIng
    settIngObj.save(function () {
      // Request Sett ings
      request(app).get('/api/settIngs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sett ing if not signed in', function (done) {
    // Create new Sett ing model instance
    var settIngObj = new SettIng(settIng);

    // Save the Sett ing
    settIngObj.save(function () {
      request(app).get('/api/settIngs/' + settIngObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', settIng.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sett ing with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/settIngs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sett ing is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sett ing which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sett ing
    request(app).get('/api/settIngs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sett ing with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sett ing if signed in', function (done) {
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

        // Save a new Sett ing
        agent.post('/api/settIngs')
          .send(settIng)
          .expect(200)
          .end(function (settIngSaveErr, settIngSaveRes) {
            // Handle Sett ing save error
            if (settIngSaveErr) {
              return done(settIngSaveErr);
            }

            // Delete an existing Sett ing
            agent.delete('/api/settIngs/' + settIngSaveRes.body._id)
              .send(settIng)
              .expect(200)
              .end(function (settIngDeleteErr, settIngDeleteRes) {
                // Handle settIng error error
                if (settIngDeleteErr) {
                  return done(settIngDeleteErr);
                }

                // Set assertions
                (settIngDeleteRes.body._id).should.equal(settIngSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sett ing if not signed in', function (done) {
    // Set Sett ing user
    settIng.user = user;

    // Create new Sett ing model instance
    var settIngObj = new SettIng(settIng);

    // Save the Sett ing
    settIngObj.save(function () {
      // Try deleting Sett ing
      request(app).delete('/api/settIngs/' + settIngObj._id)
        .expect(403)
        .end(function (settIngDeleteErr, settIngDeleteRes) {
          // Set message assertion
          (settIngDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sett ing error error
          done(settIngDeleteErr);
        });

    });
  });

  it('should be able to get a single Sett ing that has an orphaned user reference', function (done) {
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

          // Save a new Sett ing
          agent.post('/api/settIngs')
            .send(settIng)
            .expect(200)
            .end(function (settIngSaveErr, settIngSaveRes) {
              // Handle Sett ing save error
              if (settIngSaveErr) {
                return done(settIngSaveErr);
              }

              // Set assertions on new Sett ing
              (settIngSaveRes.body.name).should.equal(settIng.name);
              should.exist(settIngSaveRes.body.user);
              should.equal(settIngSaveRes.body.user._id, orphanId);

              // force the Sett ing to have an orphaned user reference
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

                    // Get the Sett ing
                    agent.get('/api/settIngs/' + settIngSaveRes.body._id)
                      .expect(200)
                      .end(function (settIngInfoErr, settIngInfoRes) {
                        // Handle Sett ing error
                        if (settIngInfoErr) {
                          return done(settIngInfoErr);
                        }

                        // Set assertions
                        (settIngInfoRes.body._id).should.equal(settIngSaveRes.body._id);
                        (settIngInfoRes.body.name).should.equal(settIng.name);
                        should.equal(settIngInfoRes.body.user, undefined);

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
      SettIng.remove().exec(done);
    });
  });
});
