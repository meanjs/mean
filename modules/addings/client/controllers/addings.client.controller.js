(function () {
  'use strict';

  // Addings controller
  angular
    .module('addings')
    .controller('AddingsController', AddingsController);

  AddingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'addingResolve'];

  function AddingsController ($scope, $state, $window, Authentication, adding) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adding = adding;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Adding
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.adding.$remove($state.go('addings.list'));
      }
    }

    // Save Adding
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.addingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.adding._id) {
        vm.adding.$update(successCallback, errorCallback);
      } else {
        vm.adding.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('addings.view', {
          addingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
