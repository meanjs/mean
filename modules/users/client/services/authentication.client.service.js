(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window', '$state', '$http', '$location', '$q', 'UsersService'];

  function Authentication($window, $state, $http, $location, $q, UsersService) {

    var auth = {
      user: null,
      token: null,
      login: login,
      signout: signout,
      refresh: refresh,
      ready: $q.defer()
    };

    // Initialize service
    init();

    return auth;

    function init() {
      var token = localStorage.getItem('token') || $location.search().token || null;
      // Remove the token from the URL if present
      $location.search('token', null);

      if (token) {
        auth.token = token;
        $http.defaults.headers.common.Authorization = 'JWT ' + token;

        refresh();
      } else {
        auth.ready.resolve();
      }
    }

    function login(user, token) {
      auth.user = user;
      auth.token = token;

      localStorage.setItem('token', token);
      $http.defaults.headers.common.Authorization = 'JWT ' + token;

      auth.ready.resolve();
    }

    function signout() {
      localStorage.removeItem('token');
      auth.user = null;
      auth.token = null;

      $state.go('home', { reload: true });
    }

    function refresh() {
      UsersService.me().$promise
        .then(function (user) {
          if (!user || !user.roles || !user.roles.length) {
            signout();
            return auth.ready.resolve();
          }

          auth.user = user;
          auth.ready.resolve();
        })
        .catch(function (errorResponse) {
          auth.ready.reject(errorResponse);
        });
    }
  }
}());
