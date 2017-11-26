'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Item = mongoose.model('Item'),
  Category = mongoose.model('Category'),
  Module = mongoose.model('Module'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  item,
  category,
  module;

/**
 * Item routes tests
 */
describe('Item CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
      approvedStatus: true
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local',
      approvedStatus: true,
      role: ['ta']
    });

    // Save a user to the test db and create new item
    user.save()
      .then(function () {
        item = {
          title: 'Item Title',
          content: 'Item Content'
        }
        category = {
          title: 'Category Title'
        }
        module = {
          title: 'Module Title'
        }

        done();
      })
      .catch(done);
  });

  it('should be able to save an item if logged in with the "ta" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Call the assertion callback
            done(itemSaveErr);
          });

      });
  });

  it('should not be able to save an item if not logged in', function (done) {
    agent.post('/api/items')
      .send(item)
      .expect(403)
      .end(function (itemSaveErr, itemSaveRes) {
        // Call the assertion callback
        done(itemSaveErr);
      });
  });
  it('should not be able to save a category if not logged in', function (done) {
    agent.post('/api/categories')
      .send(category)
      .expect(403)
      .end(function (categorySaveErr, categorySaveRes) {
        // Call the assertion callback
        done(categorySaveErr);
      });
  });
  it('should not be able to save a module if not logged in', function (done) {
    agent.post('/api/modules')
      .send(module)
      .expect(403)
      .end(function (moduleSaveErr, moduleSaveRes) {
        // Call the assertion callback
        done(moduleSaveErr);
      });
  });

  it('should be able to update an item if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Call the assertion callback
            done(itemSaveErr);
          });
      });
  });

  it('should return proper error for single item with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/items/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Item is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single item which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent item
    agent.get('/api/items/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No item with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });
   //test for TA not being able to delete should go here

  it('should not be able to delete an item if not signed in', function (done) {
    // Set item user
    item.user = user;

    // Create new item model instance
    var itemObj = new Item(item);

    // Save the item
    itemObj.save(function () {
      // Try deleting item
      agent.delete('/api/items/' + itemObj._id)
        .expect(403)
        .end(function (itemDeleteErr, itemDeleteRes) {
          // Set message assertion
          (itemDeleteRes.body.message).should.match('User is not yet approved for database changes (check attribute approvedStatus)');

          // Handle item error error
          done(itemDeleteErr);
        });

    });
  });

  it('should be able to get a single item that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3',
      approvedStatus: true
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin'],
      approvedStatus: true
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

          // Save a new item
          agent.post('/api/items')
            .send(item)
            .expect(200)
            .end(function (itemSaveErr, itemSaveRes) {
              // Handle item save error
              if (itemSaveErr) {
                return done(itemSaveErr);
              }

              // Set assertions on new item
              (itemSaveRes.body.title).should.equal(item.title);
              should.exist(itemSaveRes.body.user);
              should.equal(itemSaveRes.body.user._id, orphanId);

              // force the item to have an orphaned user reference
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

                    // Get the item
                    agent.get('/api/items/' + itemSaveRes.body._id)
                      .expect(200)
                      .end(function (itemInfoErr, itemInfoRes) {
                        // Handle item error
                        if (itemInfoErr) {
                          return done(itemInfoErr);
                        }

                        // Set assertions
                        (itemInfoRes.body._id).should.equal(itemSaveRes.body._id);
                        (itemInfoRes.body.title).should.equal(item.title);
                        should.equal(itemInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get single item, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'itemowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Item
    var _itemOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      approvedStatus : true,
      roles: ['admin']
    });

    _itemOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Item
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new item
          agent.post('/api/items')
            .send(item)
            .expect(200)
            .end(function (itemSaveErr, itemSaveRes) {
              // Handle item save error
              if (itemSaveErr) {
                return done(itemSaveErr);
              }

              // Set assertions on new item
              (itemSaveRes.body.title).should.equal(item.title);
              should.exist(itemSaveRes.body.user);
              should.equal(itemSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the item
                  agent.get('/api/items/' + itemSaveRes.body._id)
                    .expect(200)
                    .end(function (itemInfoErr, itemInfoRes) {
                      // Handle item error
                      if (itemInfoErr) {
                        return done(itemInfoErr);
                      }

                      // Set assertions
                      (itemInfoRes.body._id).should.equal(itemSaveRes.body._id);
                      (itemInfoRes.body.title).should.equal(item.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (itemInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Item.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
