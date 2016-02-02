'use strict';

var should = require('should'),
  path = require('path'),
  authentication = require(path.resolve('./config/lib/jwtAuthentication'));

/*
  Globals
*/
var token, token1;
/**
 * User routes tests
 */
describe('JWT tests', function () {

  it('should sign a token', function (done) {
    token = authentication.signToken({ _id: 'okiedokie' });
    should.exist(token);

    return done();
  });

  it('should be null if no user is sent', function (done) {
    token = authentication.signToken();
    should.not.exist(token);

    return done();
  });

  it('should allow override options to jsonwebtoken', function (done) {
    token = authentication.signToken({ _id: 'okiedokie' }, { noTimestamp: true, expiresIn: 300 });
    token1 = authentication.signToken({ _id: 'okiedokie' }, { noTimestamp: true, expiresIn: 300 });

    token.should.equal(token1);

    token = authentication.signToken({ _id: 'okiedokie' }, { noTimestamp: true, expiresIn: 300 });
    token1 = authentication.signToken({ _id: 'okiedokie' }, { noTimestamp: true, expiresIn: 400 });

    token.should.not.equal(token1);

    return done();
  });

});
