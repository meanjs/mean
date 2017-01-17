(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window', '$state', '$http', '$location', '$q', 'UsersService'];

  function Authentication($window, $state, $http, $location, $q, UsersService) {
    var readyPromise = $q.defer();

    var auth = {
      user: null,
      token: null,
      login: login,
      signout: signout,
      refresh: refresh,
      ready: readyPromise.promise
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
        readyPromise.resolve(auth);
      }
    }

    function login(user, token) {
      auth.user = user;
      auth.token = token;

      localStorage.setItem('token', token);
      $http.defaults.headers.common.Authorization = 'JWT ' + token;

      readyPromise.resolve(auth);
    }

    function signout() {
      localStorage.removeItem('token');
      auth.user = null;
      auth.token = null;

      $state.go('home', { reload: true });
    }

    function refresh() {
      readyPromise = $q.defer();

      UsersService.me().$promise
      .then(function (user) {
        auth.user = user;
        readyPromise.resolve(auth);
      })
      .catch(function (errorResponse) {
        readyPromise.reject(errorResponse);
      });
    }
  }
}());
