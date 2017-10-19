'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Item = mongoose.model('Item'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  item;

/**
 * Item routes tests
 */
describe('Item Admin CRUD tests', function () {
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
      approvedStatus : true
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      approvedStatus : true,
      provider: 'local'

    });

    // Save a user to the test db and create new item
    user.save()
      .then(function () {
        item = {
          title: 'Item Title',
          content: 'Item Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an item if logged in', function (done) {
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

        // Save a new item
        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Handle item save error
            if (itemSaveErr) {
              return done(itemSaveErr);
            }

            // Get a list of items
            agent.get('/api/items')
              .end(function (itemsGetErr, itemsGetRes) {
                // Handle item save error
                if (itemsGetErr) {
                  return done(itemsGetErr);
                }

                // Get items list
                var items = itemsGetRes.body;

                // Set assertions
                (items[0].user._id).should.equal(userId);
                (items[0].title).should.match('Item Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an item if signed in', function (done) {
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

        // Save a new item
        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Handle item save error
            if (itemSaveErr) {
              return done(itemSaveErr);
            }

            // Update item title
            item.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing item
            agent.put('/api/items/' + itemSaveRes.body._id)
              .send(item)
              .expect(200)
              .end(function (itemUpdateErr, itemUpdateRes) {
                // Handle item update error
                if (itemUpdateErr) {
                  return done(itemUpdateErr);
                }

                // Set assertions
                (itemUpdateRes.body._id).should.equal(itemSaveRes.body._id);
                (itemUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an item if no title is provided', function (done) {
    // Invalidate title field
    item.title = '';

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

        // Save a new item
        agent.post('/api/items')
          .send(item)
          .expect(422)
          .end(function (itemSaveErr, itemSaveRes) {
            // Set message assertion
            (itemSaveRes.body.message).should.match('Title cannot be blank');

            // Handle item save error
            done(itemSaveErr);
          });
      });
  });

  it('should be able to delete an item if signed in', function (done) {
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

        // Save a new item
        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Handle item save error
            if (itemSaveErr) {
              return done(itemSaveErr);
            }

            // Delete an existing item
            agent.delete('/api/items/' + itemSaveRes.body._id)
              .send(item)
              .expect(200)
              .end(function (itemDeleteErr, itemDeleteRes) {
                // Handle item error error
                if (itemDeleteErr) {
                  return done(itemDeleteErr);
                }

                // Set assertions
                (itemDeleteRes.body._id).should.equal(itemSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single item if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new item model instance
    item.user = user;
    var itemObj = new Item(item);

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

        // Save a new item
        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Handle item save error
            if (itemSaveErr) {
              return done(itemSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (itemInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
