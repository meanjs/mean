'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function () {
	before(function (done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});

		done();
	});

	describe('Method Save', function () {
		it('should begin with no users', function (done) {
			User.find({}, function (err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function (done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function (done) {
			user.save(function () {
				user2.save(function (err) {
					should.exist(err);
					done();
				});
			});
		});

		it('should be able to show an error when try to save without first name', function (done) {
			user.firstName = '';
			return user.save(function (err) {
				should.exist(err);
				done();
			});
		});

		it('should confirm that saving user model doesnt change the password', function (done) {
			user.firstName = 'test';
			var passwordBefore = user.password;
			return user.save(function (err) {
				var passwordAfter = user.password;
				passwordBefore.should.equal(passwordAfter);
				done();
			});
		});
	});

	after(function (done) {
		User.remove().exec(done);
	});
});
