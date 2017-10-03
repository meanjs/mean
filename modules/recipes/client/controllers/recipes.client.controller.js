(function () {
  'use strict';

  // Recipes controller
  angular
    .module('recipes')
    .controller('RecipesController', RecipesController);

  RecipesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'recipeResolve'];

  function RecipesController ($scope, $state, $window, Authentication, recipe) {
    var vm = this;

    vm.authentication = Authentication;
    vm.recipe = recipe;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Recipe
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.recipe.$remove($state.go('recipes.list'));
      }
    }

    // Save Recipe
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.recipeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.recipe._id) {
        vm.recipe.$update(successCallback, errorCallback);
      } else {
        vm.recipe.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('recipes.view', {
          recipeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
