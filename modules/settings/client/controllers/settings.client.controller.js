(function () {
  'use strict';

  // Settings controller
  angular
    .module('settings')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'settingResolve'];

  function SettingsController ($scope, $state, $window, Authentication, setting) {
    var vm = this;

    vm.authentication = Authentication;
    vm.setting = setting;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Setting
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.setting.$remove($state.go('settings.list'));
      }
    }

    // Save Setting
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.settingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.setting._id) {
        vm.setting.$update(successCallback, errorCallback);
      } else {
        vm.setting.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('settings.view', {
          settingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
