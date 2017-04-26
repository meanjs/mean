'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Imagegalleries Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/imagegalleries',
      permissions: '*'
    }, {
      resources: '/api/imagegalleries/:imagegalleryId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/imagegalleries',
      permissions: ['get', 'post']
    }, {
      resources: '/api/imagegalleries/:imagegalleryId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/imagegalleries',
      permissions: ['get']
    }, {
      resources: '/api/imagegalleries/:imagegalleryId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Imagegalleries Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Imagegallery is being processed and the current user created it then allow any manipulation
  if (req.imagegallery && req.user && req.imagegallery.user && req.imagegallery.user.id === req.user.id) {
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
