'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Events = mongoose.model('Event');

/**
 * Globals
 */
var user,
  events;

/**
 * Unit tests
 */
describe('Events Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      roles: 'Business',
      organization: 'Full',
      //lastName: 'Name',
      //displayName: 'Full Name',
      //email: 'test@test.com',
      username: 'test@testing.com',
      password: 'M3@n.jsI$Aw3$0m3',
      provider: 'local',
      contact: {
        firstName: 'Bob',
        lastName: 'Jones',
        phoneNumber: '1234567891'
      }
    });

    user.save(function () {
      events = new Events({
        name: 'Test Event',
        dateOfEvent: '10-21-2017',
        startTime: '4:00PM',
        endTime: '6:00PM',
        location: '3211 SE 18th CT',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return events.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      events.name = '';

      return events.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Events.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
