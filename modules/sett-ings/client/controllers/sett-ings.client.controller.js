(function () {
  'use strict';

  // Sett ings controller
  angular
    .module('sett-ings')
    .controller('SettIngsController', SettIngsController);

  SettIngsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'settIngResolve'];

  function SettIngsController ($scope, $state, $window, Authentication, settIng) {
    var vm = this;

    vm.authentication = Authentication;
    vm.settIng = settIng;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Sett ing
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.settIng.$remove($state.go('sett-ings.list'));
      }
    }

    // Save Sett ing
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.settIngForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.settIng._id) {
        vm.settIng.$update(successCallback, errorCallback);
      } else {
        vm.settIng.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sett-ings.view', {
          settIngId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
