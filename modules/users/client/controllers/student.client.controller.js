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
      } else if ($location.search().id) {
        var id = $location.search().id;
        $http.get('/api/catalog/student/' + id).then(function (response) {
          vm.user = response;
        }, function (error) {
          // nada
        });
      }
    }
  }
}());
