'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Recipe = mongoose.model('Recipe'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  recipe;

/**
 * Recipe routes tests
 */
describe('Recipe CRUD tests', function () {

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

    // Save a user to the test db and create new Recipe
    user.save(function () {
      recipe = {
        name: 'Recipe name'
      };

      done();
    });
  });

  it('should be able to save a Recipe if logged in', function (done) {
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

        // Save a new Recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(200)
          .end(function (recipeSaveErr, recipeSaveRes) {
            // Handle Recipe save error
            if (recipeSaveErr) {
              return done(recipeSaveErr);
            }

            // Get a list of Recipes
            agent.get('/api/recipes')
              .end(function (recipesGetErr, recipesGetRes) {
                // Handle Recipes save error
                if (recipesGetErr) {
                  return done(recipesGetErr);
                }

                // Get Recipes list
                var recipes = recipesGetRes.body;

                // Set assertions
                (recipes[0].user._id).should.equal(userId);
                (recipes[0].name).should.match('Recipe name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Recipe if not logged in', function (done) {
    agent.post('/api/recipes')
      .send(recipe)
      .expect(403)
      .end(function (recipeSaveErr, recipeSaveRes) {
        // Call the assertion callback
        done(recipeSaveErr);
      });
  });

  it('should not be able to save an Recipe if no name is provided', function (done) {
    // Invalidate name field
    recipe.name = '';

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

        // Save a new Recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(400)
          .end(function (recipeSaveErr, recipeSaveRes) {
            // Set message assertion
            (recipeSaveRes.body.message).should.match('Please fill Recipe name');

            // Handle Recipe save error
            done(recipeSaveErr);
          });
      });
  });

  it('should be able to update an Recipe if signed in', function (done) {
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

        // Save a new Recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(200)
          .end(function (recipeSaveErr, recipeSaveRes) {
            // Handle Recipe save error
            if (recipeSaveErr) {
              return done(recipeSaveErr);
            }

            // Update Recipe name
            recipe.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Recipe
            agent.put('/api/recipes/' + recipeSaveRes.body._id)
              .send(recipe)
              .expect(200)
              .end(function (recipeUpdateErr, recipeUpdateRes) {
                // Handle Recipe update error
                if (recipeUpdateErr) {
                  return done(recipeUpdateErr);
                }

                // Set assertions
                (recipeUpdateRes.body._id).should.equal(recipeSaveRes.body._id);
                (recipeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Recipes if not signed in', function (done) {
    // Create new Recipe model instance
    var recipeObj = new Recipe(recipe);

    // Save the recipe
    recipeObj.save(function () {
      // Request Recipes
      request(app).get('/api/recipes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Recipe if not signed in', function (done) {
    // Create new Recipe model instance
    var recipeObj = new Recipe(recipe);

    // Save the Recipe
    recipeObj.save(function () {
      request(app).get('/api/recipes/' + recipeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', recipe.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Recipe with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/recipes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Recipe is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Recipe which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Recipe
    request(app).get('/api/recipes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Recipe with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Recipe if signed in', function (done) {
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

        // Save a new Recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(200)
          .end(function (recipeSaveErr, recipeSaveRes) {
            // Handle Recipe save error
            if (recipeSaveErr) {
              return done(recipeSaveErr);
            }

            // Delete an existing Recipe
            agent.delete('/api/recipes/' + recipeSaveRes.body._id)
              .send(recipe)
              .expect(200)
              .end(function (recipeDeleteErr, recipeDeleteRes) {
                // Handle recipe error error
                if (recipeDeleteErr) {
                  return done(recipeDeleteErr);
                }

                // Set assertions
                (recipeDeleteRes.body._id).should.equal(recipeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Recipe if not signed in', function (done) {
    // Set Recipe user
    recipe.user = user;

    // Create new Recipe model instance
    var recipeObj = new Recipe(recipe);

    // Save the Recipe
    recipeObj.save(function () {
      // Try deleting Recipe
      request(app).delete('/api/recipes/' + recipeObj._id)
        .expect(403)
        .end(function (recipeDeleteErr, recipeDeleteRes) {
          // Set message assertion
          (recipeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Recipe error error
          done(recipeDeleteErr);
        });

    });
  });

  it('should be able to get a single Recipe that has an orphaned user reference', function (done) {
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

          // Save a new Recipe
          agent.post('/api/recipes')
            .send(recipe)
            .expect(200)
            .end(function (recipeSaveErr, recipeSaveRes) {
              // Handle Recipe save error
              if (recipeSaveErr) {
                return done(recipeSaveErr);
              }

              // Set assertions on new Recipe
              (recipeSaveRes.body.name).should.equal(recipe.name);
              should.exist(recipeSaveRes.body.user);
              should.equal(recipeSaveRes.body.user._id, orphanId);

              // force the Recipe to have an orphaned user reference
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

                    // Get the Recipe
                    agent.get('/api/recipes/' + recipeSaveRes.body._id)
                      .expect(200)
                      .end(function (recipeInfoErr, recipeInfoRes) {
                        // Handle Recipe error
                        if (recipeInfoErr) {
                          return done(recipeInfoErr);
                        }

                        // Set assertions
                        (recipeInfoRes.body._id).should.equal(recipeSaveRes.body._id);
                        (recipeInfoRes.body.name).should.equal(recipe.name);
                        should.equal(recipeInfoRes.body.user, undefined);

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
      Recipe.remove().exec(done);
    });
  });
});
