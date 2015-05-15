'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Article = mongoose.model('Article'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, article;
var voteDirections = ['none', 'up', 'down'];

/**
 * User vote route tests
 */
describe('User vote tests', function() {
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

		// Save a user to the test db and create and save new article
		user.save(function() {
			article = new Article({
				title: 'Article Title',
				content: 'Article Content',
				user: user
			});

			article.save(function() {
				done();
			});
		});
	});

	it('should not be able to vote if not logged in', function(done) {
		agent.put('/users/vote/up/' + article._id)
			.expect(401)
			.end(function(voteAuthErr, voteAuthRes) {
				// Call the assertion callback
				done(voteAuthErr);
			});
	});

	it('should not be able to vote if direction is invalid', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				agent.put('/users/vote/invalidDirection/' + article._id)
					.send(credentials)
					.expect(400)
					.end(function(voteErr, voteRes) {
						// Call the assertion callback
						done(voteErr);
					});
		})
	});

	function testVoteSequence(firstVoteDirection, secondVoteDirection) {
		it('should be able to vote ' + firstVoteDirection + ' direction and then ' + secondVoteDirection + ' direction on an article if logged in', function(done) {
			agent.post('/auth/signin')
				.send(credentials)
				.expect(200)
				.end(function(signinErr, signinRes) {
					// Handle signin error
					if (signinErr) done(signinErr);

					// make the first vote
					agent.put('/users/vote/' + firstVoteDirection + '/' + article._id)
						.expect(200)
						.end(function(voteErr, voteRes) {
							voteRes.body.oldVoteDirection.should.match('none');
							voteRes.body.newVoteDirection.should.match(firstVoteDirection);

							// make the second vote
							agent.put('/users/vote/' + secondVoteDirection + '/' + article._id)
								.expect(200)
								.end(function(voteErr, voteRes) {
									voteRes.body.oldVoteDirection.should.match(firstVoteDirection);
									voteRes.body.newVoteDirection.should.match(secondVoteDirection);

									// make sure Article vote counts are correct
									request(app).get('/articles/' + article._id)
										.end(function(req, res) {
											res.body.upVotes.should.be.equal(secondVoteDirection === 'up' ? 1 : 0);
											res.body.downVotes.should.be.equal(secondVoteDirection === 'down' ? 1 : 0);
											done();
										});

								});

						});

				})
		});
	}

	for (var firstIndex in voteDirections) {
		for (var secondIndex in voteDirections) {
			testVoteSequence(voteDirections[firstIndex], voteDirections[secondIndex]);
		}
	}

	afterEach(function(done) {
		User.remove().exec(function() {
			Article.remove().exec(done);
		});
	});
});
