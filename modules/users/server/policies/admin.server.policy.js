'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows:[
    {
      resources: '/api/users',
      permissions: '*'
    }, 
    {
      resources: '/api/users/:userId',
      permissions: '*'
    },
    {
      resources: '/api/users/:userId',
      permissions: '*'
    }
    ]
  }]);
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles;
  if(req.user) {
    roles = req.user.roles;
  } else{
    roles = ['guest'];
  }
  //If a user is not yet an approved user, do not allow any changes to be made on the database.
  if(!req.user || !req.user.approvedStatus || req.user.approvedStatus != true) {
    return res.status(403).json({
      message: 'User is not yet approved for database changes (check attribute approvedStatus)'
    });
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
