(function () {
  'use strict';

  angular
    .module('users')
    .controller('StudentController', StudentController);

  StudentController.$inject = ['$scope', '$state', '$stateParams', 'Authentication', '$window'];

  function StudentController($scope, $state, $stateParams, Authentication, $window) {
    var vm = this;

    vm.authentication = Authentication;
    if ($stateParams.student !== null && $stateParams.student !== undefined) {
      vm.user = $stateParams.student;
    } else if ($window.student !== null && $window.student !== undefined) {
      vm.user = $window.student;
    }
  }
}());
