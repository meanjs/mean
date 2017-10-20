'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Recipedetails Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/recipedetails',
      permissions: '*'
    }, {
      resources: '/api/recipedetails/:recipedetailId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/recipedetails',
      permissions: ['get', 'post']
    }, {
      resources: '/api/recipedetails/:recipedetailId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/recipedetails',
      permissions: ['get']
    }, {
      resources: '/api/recipedetails/:recipedetailId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Recipedetails Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Recipedetail is being processed and the current user created it then allow any manipulation
  if (req.recipedetail && req.user && req.recipedetail.user && req.recipedetail.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
