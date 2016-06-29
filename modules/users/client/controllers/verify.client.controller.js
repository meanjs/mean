(function () {
  'use strict';

  angular
    .module('users')
    .controller('VerifyController', VerifyController);

  VerifyController.$inject = ['$scope', '$state', '$http', 'Authentication', '$stateParams', '$location'];

  function VerifyController($scope, $state, $http, Authentication, $stateParams, $location) {
    var vm = this;

    vm.authentication = Authentication;

    vm.isResetSent = false;
    vm.credentials = {};
    vm.error = '';
    vm.validateVerifyToken = validateVerifyToken;
    vm.resendVerifyEmail = resendVerifyEmail;

    // Get an eventual error defined in the URL query string:
    vm.error = $location.search().err;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    function resendVerifyEmail() {
      $http.post('/api/auth/verify', { email: vm.credentials.email }).success(function(response) {
        vm.success = response.message;
        vm.credentials = null;
        vm.isResetSent = true;
      }).error(function(response) {
        vm.isResetSent = false;
        vm.credentials.email = null;
        vm.error = response.message;
      });
    }

    // Validate Verification Token
    function validateVerifyToken() {
      if ($stateParams.token) {

        var token = $stateParams.token;
        var validTokenRe = /^([A-Za-z0-9]{48})$/g;
        if (!validTokenRe.test(token)) {
          throw new Error('Error token: ' + token + ' is not a valid verification token');
        }

        $http.get('/api/auth/verify/' + token).success(function(response) {
          vm.success = response.message;
          vm.isResetSent = true;
          vm.credentials.email = null;
        }).error(function(response) {
          vm.isResetSent = false;
          vm.credentials.email = null;
          vm.error = response.message;
        });
      }
    }


    function signup(isValid) {
      vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      $http.post('/api/auth/signup', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        vm.error = response.message;
      });
    }

    function signin(isValid) {
      vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      $http.post('/api/auth/signin', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        vm.error = response.message;
      });
    }
  }
}());
