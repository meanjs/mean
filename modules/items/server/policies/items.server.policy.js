'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Items Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'superta', 'technician'], //All should be able to create, read, update, and delete items.
    allows: [{
      resources: '/api/items',
      permissions: '*'
    },
    {
      resources: '/api/items/create',
      permissions: '*'
    },
    {
      resources: '/api/items/:itemId',
      permissions: '*'
    },
    {
      resources: '/api/categories',
      permissions: '*'
    },
    {
      resources: '/api/modules',
      permissions: '*'
    },
    {
      resources: '/api/categories',
      permissions: '*'
    },
    {
      resources: '/api/modules',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/items',
      permissions: ['get', 'put', 'post']
    },
    {
      resources: '/api/items/create',
      permissions: ['get', 'put', 'post']
    },
    {
      resources: '/api/items/:itemId',
      permissions: ['get', 'post', 'put'] //TA's can modify and create items but not delete them from the database.
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/articles',
      permissions: ['get']
    }, {
      resources: '/api/articles/:articleId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Items Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  if(!req.user || !req.user.approvedStatus || req.user.approvedStatus != true) {
  // If an item is being processed and the current user created it then allow any manipulation
  if (req.item && req.user && req.item.user && req.item.user.id === req.user.id) {
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
