'use strict';

// Authentication service for user variables
angular.module('users').service('Authentication', ['$http', '$q', 'Socket', '$rootScope',
  function ($http, $q, Socket, $rootScope) {
    var user = false;
    var token_key = 'auth_token';
    Object.defineProperty(this, 'user', {
      user: user,
      get: function () {
        return user;
      },
      set: function (new_user) {
        user = new_user;
        window.user = new_user;
        if (new_user && new_user.loginToken) {
          localStorage.setItem(token_key, new_user.loginToken);
          $http.defaults.headers.common.Authentication = new_user.loginToken;
          Socket.emit('join', (new_user._id || new_user));
        } else {
          localStorage.removeItem(token_key);
          delete $http.defaults.headers.common.Authentication;
          $rootScope.$broadcast('event:auth-login_required');
        }
      }
    });
    this.set_prop = function (propname, value) {
      user[propname] = value;
    };
  }
]);
