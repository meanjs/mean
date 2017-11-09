(function () {
  'use strict';

  angular
    .module('users')
    .controller('StudentController', StudentController);

  StudentController.$inject = ['$scope', '$state', '$http', '$stateParams', 'Authentication', '$window', '$location'];

  function StudentController($scope, $state, $http, $stateParams, Authentication, $window, $location) {
    var vm = this;

    vm.authentication = Authentication;

    loadUser();

    function loadUser() {
      // Get an eventual error defined in the URL query string:
      if ($stateParams.student !== null && $stateParams.student !== undefined) {
        vm.user = $stateParams.student;
      } else if ($window.student !== null && $window.student !== undefined) {
        vm.user = $window.student;
      } else if ($location.search().username) {
        var username = $location.search().username;
        $http.get('/api/profile/' + username).then(function (response) {
          vm.user = response.data;
        }, function (error) {
          // nada
        });
      }
    }
  }
}());
