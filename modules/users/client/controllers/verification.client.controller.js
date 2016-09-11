(function () {
  'use strict';

  angular
    .module('users')
    .controller('VerificationController', VerificationController);

  VerificationController.$inject = ['$scope', '$state', '$http', 'Authentication', '$stateParams', '$location'];

  function VerificationController($scope, $state, $http, Authentication, $stateParams, $location) {
    var vm = this;

    vm.authentication = Authentication;

    vm.credentials = {};
    vm.validateVerificationToken = validateVerificationToken;
    vm.resendVerificationEmail = resendVerificationEmail;

    // Get an eventual error defined in the URL query string:
    vm.error = $location.search().err;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // If we have a token, attempt to validate
    if ($stateParams.token) {
      vm.validateVerificationToken();
    }

    function resendVerificationEmail() {
      vm.success = vm.error = null;
      if (vm.credentials.email) {
        $http.post('/api/auth/verify', { email: vm.credentials.email }).success(function(response) {
          vm.credentials.email = null;
          vm.success = response.message;
        }).error(function(response) {
          vm.credentials.email = null;
          vm.error = response.message;
        });
      } else {
        vm.error = 'Please enter an email address';
      }
    }

    function validateVerificationToken() {
      vm.success = vm.error = null;

      var token = $stateParams.token;
      var validTokenRe = /^([A-Za-z0-9]{48})$/g;
      if (validTokenRe.test(token)) {

        $http.get('/api/auth/verify/' + token).success(function(response) {
          vm.credentials.email = null;
          vm.success = response.message;
        }).error(function(response) {
          vm.credentials.email = null;
          vm.error = response.message;
        });
      } else {
        vm.error = 'Verification token was invalid.';
      }
    }

  }
}());

