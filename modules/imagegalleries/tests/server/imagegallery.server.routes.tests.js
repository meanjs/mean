'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Imagegallery = mongoose.model('Imagegallery'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  imagegallery;

/**
 * Imagegallery routes tests
 */
describe('Imagegallery CRUD tests', function () {

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

    // Save a user to the test db and create new Imagegallery
    user.save(function () {
      imagegallery = {
        name: 'Imagegallery name'
      };

      done();
    });
  });

  it('should be able to save a Imagegallery if logged in', function (done) {
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

        // Save a new Imagegallery
        agent.post('/api/imagegalleries')
          .send(imagegallery)
          .expect(200)
          .end(function (imagegallerySaveErr, imagegallerySaveRes) {
            // Handle Imagegallery save error
            if (imagegallerySaveErr) {
              return done(imagegallerySaveErr);
            }

            // Get a list of Imagegalleries
            agent.get('/api/imagegalleries')
              .end(function (imagegalleriesGetErr, imagegalleriesGetRes) {
                // Handle Imagegalleries save error
                if (imagegalleriesGetErr) {
                  return done(imagegalleriesGetErr);
                }

                // Get Imagegalleries list
                var imagegalleries = imagegalleriesGetRes.body;

                // Set assertions
                (imagegalleries[0].user._id).should.equal(userId);
                (imagegalleries[0].name).should.match('Imagegallery name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Imagegallery if not logged in', function (done) {
    agent.post('/api/imagegalleries')
      .send(imagegallery)
      .expect(403)
      .end(function (imagegallerySaveErr, imagegallerySaveRes) {
        // Call the assertion callback
        done(imagegallerySaveErr);
      });
  });

  it('should not be able to save an Imagegallery if no name is provided', function (done) {
    // Invalidate name field
    imagegallery.name = '';

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

        // Save a new Imagegallery
        agent.post('/api/imagegalleries')
          .send(imagegallery)
          .expect(400)
          .end(function (imagegallerySaveErr, imagegallerySaveRes) {
            // Set message assertion
            (imagegallerySaveRes.body.message).should.match('Please fill Imagegallery name');

            // Handle Imagegallery save error
            done(imagegallerySaveErr);
          });
      });
  });

  it('should be able to update an Imagegallery if signed in', function (done) {
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

        // Save a new Imagegallery
        agent.post('/api/imagegalleries')
          .send(imagegallery)
          .expect(200)
          .end(function (imagegallerySaveErr, imagegallerySaveRes) {
            // Handle Imagegallery save error
            if (imagegallerySaveErr) {
              return done(imagegallerySaveErr);
            }

            // Update Imagegallery name
            imagegallery.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Imagegallery
            agent.put('/api/imagegalleries/' + imagegallerySaveRes.body._id)
              .send(imagegallery)
              .expect(200)
              .end(function (imagegalleryUpdateErr, imagegalleryUpdateRes) {
                // Handle Imagegallery update error
                if (imagegalleryUpdateErr) {
                  return done(imagegalleryUpdateErr);
                }

                // Set assertions
                (imagegalleryUpdateRes.body._id).should.equal(imagegallerySaveRes.body._id);
                (imagegalleryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Imagegalleries if not signed in', function (done) {
    // Create new Imagegallery model instance
    var imagegalleryObj = new Imagegallery(imagegallery);

    // Save the imagegallery
    imagegalleryObj.save(function () {
      // Request Imagegalleries
      request(app).get('/api/imagegalleries')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Imagegallery if not signed in', function (done) {
    // Create new Imagegallery model instance
    var imagegalleryObj = new Imagegallery(imagegallery);

    // Save the Imagegallery
    imagegalleryObj.save(function () {
      request(app).get('/api/imagegalleries/' + imagegalleryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', imagegallery.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Imagegallery with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/imagegalleries/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Imagegallery is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Imagegallery which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Imagegallery
    request(app).get('/api/imagegalleries/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Imagegallery with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Imagegallery if signed in', function (done) {
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

        // Save a new Imagegallery
        agent.post('/api/imagegalleries')
          .send(imagegallery)
          .expect(200)
          .end(function (imagegallerySaveErr, imagegallerySaveRes) {
            // Handle Imagegallery save error
            if (imagegallerySaveErr) {
              return done(imagegallerySaveErr);
            }

            // Delete an existing Imagegallery
            agent.delete('/api/imagegalleries/' + imagegallerySaveRes.body._id)
              .send(imagegallery)
              .expect(200)
              .end(function (imagegalleryDeleteErr, imagegalleryDeleteRes) {
                // Handle imagegallery error error
                if (imagegalleryDeleteErr) {
                  return done(imagegalleryDeleteErr);
                }

                // Set assertions
                (imagegalleryDeleteRes.body._id).should.equal(imagegallerySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Imagegallery if not signed in', function (done) {
    // Set Imagegallery user
    imagegallery.user = user;

    // Create new Imagegallery model instance
    var imagegalleryObj = new Imagegallery(imagegallery);

    // Save the Imagegallery
    imagegalleryObj.save(function () {
      // Try deleting Imagegallery
      request(app).delete('/api/imagegalleries/' + imagegalleryObj._id)
        .expect(403)
        .end(function (imagegalleryDeleteErr, imagegalleryDeleteRes) {
          // Set message assertion
          (imagegalleryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Imagegallery error error
          done(imagegalleryDeleteErr);
        });

    });
  });

  it('should be able to get a single Imagegallery that has an orphaned user reference', function (done) {
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

          // Save a new Imagegallery
          agent.post('/api/imagegalleries')
            .send(imagegallery)
            .expect(200)
            .end(function (imagegallerySaveErr, imagegallerySaveRes) {
              // Handle Imagegallery save error
              if (imagegallerySaveErr) {
                return done(imagegallerySaveErr);
              }

              // Set assertions on new Imagegallery
              (imagegallerySaveRes.body.name).should.equal(imagegallery.name);
              should.exist(imagegallerySaveRes.body.user);
              should.equal(imagegallerySaveRes.body.user._id, orphanId);

              // force the Imagegallery to have an orphaned user reference
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

                    // Get the Imagegallery
                    agent.get('/api/imagegalleries/' + imagegallerySaveRes.body._id)
                      .expect(200)
                      .end(function (imagegalleryInfoErr, imagegalleryInfoRes) {
                        // Handle Imagegallery error
                        if (imagegalleryInfoErr) {
                          return done(imagegalleryInfoErr);
                        }

                        // Set assertions
                        (imagegalleryInfoRes.body._id).should.equal(imagegallerySaveRes.body._id);
                        (imagegalleryInfoRes.body.name).should.equal(imagegallery.name);
                        should.equal(imagegalleryInfoRes.body.user, undefined);

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
      Imagegallery.remove().exec(done);
    });
  });
});
