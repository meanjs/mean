// by bwin on 6/15/15.

'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash'),
  utils = require('../utils.server.controller');

exports.build = function (profile, user) {
  profile.salt = undefined;
  profile.password = undefined;
  profile.roles = undefined;
  profile.provider = undefined;
  profile.__v = undefined;
  profile.created = undefined;
  profile.is_current_user = utils.get_id(profile) === utils.get_id(user);
  return profile;
};
