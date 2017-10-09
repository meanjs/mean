(function () {
  'use strict';

  // Customizings controller
  angular
    .module('customizings')
    .controller('CustomizingsController', CustomizingsController);

  CustomizingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'customizingResolve'];

  function CustomizingsController ($scope, $state, $window, Authentication, customizing) {
    var vm = this;

    vm.authentication = Authentication;
    vm.customizing = customizing;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Customizing
    function remove() {
      alert("YOOOOO");
      // if ($window.confirm('Are you sure you want to delete?')) {
      //   vm.customizing.$remove($state.go('customizings.list'));
      // }

    }

    // Save Customizing
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customizingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.customizing._id) {
        vm.customizing.$update(successCallback, errorCallback);
      } else {
        vm.customizing.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('customizings.view', {
          customizingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
