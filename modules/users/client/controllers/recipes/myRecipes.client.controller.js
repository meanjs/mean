(function () {
  'use strict';

  angular
    .module('users')
    .controller('MyRecipesController', MyRecipesController);

  MyRecipesController.$inject = ['UsersService', '$scope'];

  function MyRecipesController(UsersService, $scope, user) {
    var vm = this;

    UsersService.getMyRecipes()
      .then(success)
      .catch(failure)

    function success(response) {
      console.log('worked!');
      console.log(response.recipes);
    }

    function failure(response) {
      console.log('sadness')
      console.log(response);
    }
    //vm.addings = UsersService.query();
  }
}());
