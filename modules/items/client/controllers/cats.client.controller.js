(function () {
  'use strict';

  angular
    .module('items.addCats')
    .controller('CatsController', CatsController);

  CatsController.$inject = ['$scope', '$state', '$window', 'catResolve', 'Authentication', 'Notification'];

  function CatsController($scope, $state, $window, cat, Authentication, Notification) {
    var vm = this;

    vm.cat = cat;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.cat.$remove(function () {
          $state.go('admin.items.categories');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Category deleted successfully!' });
        });
      }
    }

    // Save Item
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.catForm');
        return false;
      }

      // Create a new item, or update the current instance
      vm.cat.create()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.items.categories'); // should we send the User to the list or the updated Item's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Category saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Category save error!' });
      }
    }
  }
}());

