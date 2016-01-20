(function() {
  'use strict';

  angular
    .module('users')
    .service('Authentication', Authentication);

  Authentication.$inject = ['$resource', '$q'];
  function Authentication($resource, $q) {


    var service = {
      ready: init(),
      user: null,
      refresh: init
    };

    function init() {
      return $q(function(resolve, reject) {
        $resource('api/users/me')
          .get().$promise
          .then(function (user) {
            console.log(user);
            service.user = user;
            resolve(service);
          })
          .catch(function () {
            reject();
          });
      });
    }

    return service;
  }
})();
