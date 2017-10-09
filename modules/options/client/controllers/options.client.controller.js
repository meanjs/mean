(function () {
  'use strict';

  // Options controller
  angular
    .module('options')
    .controller('OptionsController', OptionsController);

  OptionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'optionResolve'];

  function OptionsController ($scope, $state, $window, Authentication, option) {
    var vm = this;

    vm.authentication = Authentication;
    vm.option = option;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Option
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.option.$remove($state.go('options.list'));
      }
    }

    // Save Option
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.optionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.option._id) {
        vm.option.$update(successCallback, errorCallback);
      } else {
        vm.option.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('options.view', {
          optionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
