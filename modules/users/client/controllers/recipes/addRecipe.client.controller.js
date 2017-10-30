(function () {
  'use strict';

  angular
    .module('users')
    .controller('AddRecipeController', AddRecipeController);

  AddRecipeController.$inject = ['UsersService', '$scope', '$http','Authentication','Notification'];

  function AddRecipeController(UsersService, $scope, $http,Authentication,Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;

    function updateUserProfile(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!' });
        Authentication.user = response;
      }, function (response) {
        Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!' });
      });
    }



    var alternative = {
      'hello' : 'world'
    }

    $http.get('food_alternatives.json')
      .then( (response) => {
        console.log(response);
      });

    UsersService.usdaAlternatives(alternative)
      .then(success)
      .catch(failure)

    function success(response) {
      console.log('worked!');
      console.log(response);
    }

    function failure(response) {
      console.log('sadness')
      console.log(response);
    }

    //DO YOUR FRONTEND JS CODE HERE
//===========================================================================
    $scope.recipeList = [{}];

    $scope.recipeAdd = function() {
        $scope.recipeList.push({});
    };
//===========================================================================

    // $scope.alert = () => {
  	// 	alert('hello');
  	// }

    //vm.addings = UsersService.query();
  }
}());
