(function() {
  'use strict';

  angular
    .module('users')
    .service('Authentication', Authentication);

  Authentication.$inject = ['$q', '$resource', '$http', '$location', '$state'];
  function Authentication($q, $resource, $http, $location, $state) {

    var readyPromise = $q.defer();

    var service = {
      ready: readyPromise.promise,
      user: null,
      token: null,
      login: login,
      signout: signout,
      refresh: refresh
    };

    function login(user, token) {
      setUser(user);
      setToken(token);
      setHeader();
      readyPromise.resolve(service);
    }

    function setUser(user) {
      service.user = user;
    }

    function setToken(token) {
      service.token = token;
      localStorage.setItem('token', token);
    }

    function signout() {
      localStorage.removeItem('token');
      service.user = null;
      service.token = null;
      $state.reload();
    }

    function refresh() {
      return $q(function(resolve, reject) {
        readyPromise = $q.defer();
        $resource('api/users/me').get().$promise
          .then(function (user) {
            setUser(user);
            readyPromise.resolve(service);
            resolve(service);
          });
      });

    }

    function setHeader() {
      $http.defaults.headers.common.Authorization = 'JWT ' + service.token;
    }

    function init() {
      service.token = localStorage.getItem('token') || $location.search().token || null;

      //Remove token from URL
      $location.search('token', null);

      if (service.token) {
        setHeader();
        refresh();
      } else {
        readyPromise.resolve(service);
      }
    }

    //Run init
    init();

    return service;
  }
})();
