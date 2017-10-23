(function () {
  'use strict';

  // Recipedetails controller
  angular
    .module('recipedetails')
    .controller('RecipedetailsController', RecipedetailsController);

  RecipedetailsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'recipedetailResolve'];

  function RecipedetailsController ($scope, $state, $window, Authentication, recipedetail) {
    var vm = this;

    vm.authentication = Authentication;
    vm.recipedetail = recipedetail;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Recipedetail
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.recipedetail.$remove($state.go('recipedetails.list'));
      }
    }

    // Save Recipedetail
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.recipedetailForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.recipedetail._id) {
        vm.recipedetail.$update(successCallback, errorCallback);
      } else {
        vm.recipedetail.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('recipedetails.view', {
          recipedetailId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
