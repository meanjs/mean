'use strict';

/**
 * Chat socket tests
 */

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  sinon = require('sinon'),
  User = mongoose.model('User'),
  express = require(path.resolve('./config/lib/express')),
  io = require('socket.io/node_modules/socket.io-client');

/**
 * Globals
 */
var app, agent, credentials, ioc, user, admin, sessionId, clock;

describe('Socket Chat tests:', function() {

  // Get application
  before(function(done) {
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  // create the user
  beforeEach(function(done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
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

    // Save a user to the test db
    user.save(function () {
      done();
    });
  });

  it('should be able to connect on socket', function(done) {
    clock = sinon.useFakeTimers(Date.now());

    var testMessage = {
      created: Date.now(),
      profileImageURL: 'modules/users/client/img/profile/default.png',
      text: 'Is now connected',
      type: 'status',
      username: 'username'
    };

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, res) {
        // console.log('---agent: ',agent);

        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        var socket, cookies;
        if (res.headers && res.headers['set-cookie'] && res.headers['set-cookie'].length > 0) {
          cookies = res.headers['set-cookie'].join(';');
        }

        if (cookies) {
          socket = io('http://localhost:3001', {
            extraHeaders: {
              'Cookie': cookies
            }
          });
        } else {
          socket = io('http://localhost:3001');
        }

        // socket.on('disconnect', function () {
        //   console.log('disconnected');
        // });

        socket.on('error', function (err) {
          return done(err);
        });

        socket.on('connect', function () {
          // console.log('connected');

          socket.on('chatMessage', function (data) {
            console.log('test-result from chatMessage (chat.socket.tests.js:105) -->',data);
            data.should.eql(testMessage);
            done();
          });
        });

      });

  });

  afterEach(function(done) {
    User.remove().exec(done);
    clock.restore();
  });
});
