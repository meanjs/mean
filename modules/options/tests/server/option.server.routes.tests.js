'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Option = mongoose.model('Option'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  option;

/**
 * Option routes tests
 */
describe('Option CRUD tests', function () {

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

    // Save a user to the test db and create new Option
    user.save(function () {
      option = {
        name: 'Option name'
      };

      done();
    });
  });

  it('should be able to save a Option if logged in', function (done) {
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

        // Save a new Option
        agent.post('/api/options')
          .send(option)
          .expect(200)
          .end(function (optionSaveErr, optionSaveRes) {
            // Handle Option save error
            if (optionSaveErr) {
              return done(optionSaveErr);
            }

            // Get a list of Options
            agent.get('/api/options')
              .end(function (optionsGetErr, optionsGetRes) {
                // Handle Options save error
                if (optionsGetErr) {
                  return done(optionsGetErr);
                }

                // Get Options list
                var options = optionsGetRes.body;

                // Set assertions
                (options[0].user._id).should.equal(userId);
                (options[0].name).should.match('Option name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Option if not logged in', function (done) {
    agent.post('/api/options')
      .send(option)
      .expect(403)
      .end(function (optionSaveErr, optionSaveRes) {
        // Call the assertion callback
        done(optionSaveErr);
      });
  });

  it('should not be able to save an Option if no name is provided', function (done) {
    // Invalidate name field
    option.name = '';

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

        // Save a new Option
        agent.post('/api/options')
          .send(option)
          .expect(400)
          .end(function (optionSaveErr, optionSaveRes) {
            // Set message assertion
            (optionSaveRes.body.message).should.match('Please fill Option name');

            // Handle Option save error
            done(optionSaveErr);
          });
      });
  });

  it('should be able to update an Option if signed in', function (done) {
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

        // Save a new Option
        agent.post('/api/options')
          .send(option)
          .expect(200)
          .end(function (optionSaveErr, optionSaveRes) {
            // Handle Option save error
            if (optionSaveErr) {
              return done(optionSaveErr);
            }

            // Update Option name
            option.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Option
            agent.put('/api/options/' + optionSaveRes.body._id)
              .send(option)
              .expect(200)
              .end(function (optionUpdateErr, optionUpdateRes) {
                // Handle Option update error
                if (optionUpdateErr) {
                  return done(optionUpdateErr);
                }

                // Set assertions
                (optionUpdateRes.body._id).should.equal(optionSaveRes.body._id);
                (optionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Options if not signed in', function (done) {
    // Create new Option model instance
    var optionObj = new Option(option);

    // Save the option
    optionObj.save(function () {
      // Request Options
      request(app).get('/api/options')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Option if not signed in', function (done) {
    // Create new Option model instance
    var optionObj = new Option(option);

    // Save the Option
    optionObj.save(function () {
      request(app).get('/api/options/' + optionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', option.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Option with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/options/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Option is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Option which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Option
    request(app).get('/api/options/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Option with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Option if signed in', function (done) {
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

        // Save a new Option
        agent.post('/api/options')
          .send(option)
          .expect(200)
          .end(function (optionSaveErr, optionSaveRes) {
            // Handle Option save error
            if (optionSaveErr) {
              return done(optionSaveErr);
            }

            // Delete an existing Option
            agent.delete('/api/options/' + optionSaveRes.body._id)
              .send(option)
              .expect(200)
              .end(function (optionDeleteErr, optionDeleteRes) {
                // Handle option error error
                if (optionDeleteErr) {
                  return done(optionDeleteErr);
                }

                // Set assertions
                (optionDeleteRes.body._id).should.equal(optionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Option if not signed in', function (done) {
    // Set Option user
    option.user = user;

    // Create new Option model instance
    var optionObj = new Option(option);

    // Save the Option
    optionObj.save(function () {
      // Try deleting Option
      request(app).delete('/api/options/' + optionObj._id)
        .expect(403)
        .end(function (optionDeleteErr, optionDeleteRes) {
          // Set message assertion
          (optionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Option error error
          done(optionDeleteErr);
        });

    });
  });

  it('should be able to get a single Option that has an orphaned user reference', function (done) {
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

          // Save a new Option
          agent.post('/api/options')
            .send(option)
            .expect(200)
            .end(function (optionSaveErr, optionSaveRes) {
              // Handle Option save error
              if (optionSaveErr) {
                return done(optionSaveErr);
              }

              // Set assertions on new Option
              (optionSaveRes.body.name).should.equal(option.name);
              should.exist(optionSaveRes.body.user);
              should.equal(optionSaveRes.body.user._id, orphanId);

              // force the Option to have an orphaned user reference
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

                    // Get the Option
                    agent.get('/api/options/' + optionSaveRes.body._id)
                      .expect(200)
                      .end(function (optionInfoErr, optionInfoRes) {
                        // Handle Option error
                        if (optionInfoErr) {
                          return done(optionInfoErr);
                        }

                        // Set assertions
                        (optionInfoRes.body._id).should.equal(optionSaveRes.body._id);
                        (optionInfoRes.body.name).should.equal(option.name);
                        should.equal(optionInfoRes.body.user, undefined);

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
      Option.remove().exec(done);
    });
  });
});
