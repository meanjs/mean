'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', 'Users',
  function ($scope, $state, Authentication, Menus, Users) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    // Sign Out
    $scope.signout = function(){
      Users.sign_out(function(successResponse){
        Authentication.user = null;
        // Redirect to signin page
        $state.go('home', {}, { reload: true, inherit: false });
      }, function(errorResponse){
        Authentication.user = null;
        $scope.error = errorResponse.message;
      });
    };

  }
]);
