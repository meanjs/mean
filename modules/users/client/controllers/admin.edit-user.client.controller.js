(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditUserController', EditUserController);

  EditUserController.$inject = ['$scope', '$state', '$stateParams', '$window', 'Authentication', 'Notification', 'AdminPowers', '$http'];

  function EditUserController($scope, $state, $stateParams, $window, Authentication, Notification, AdminPowers, $http) {
    var vm = this;

    vm.authentication = Authentication;
    $scope.user = $stateParams.user;

    if (vm.authentication.user === null) {
      $state.go('authentication.signin');
    }
    if (vm.authentication.user.type !== 'admin') {
      if (vm.authentication.type === 'sponsor') {
        $state.go('catalog');
      } else if (vm.authentication.type === 'student') {
        $state.go('profile');
      } else {
        $state.go('home');
      }
    }

    $scope.remove = function () {
      if (vm.authentication.user.type !== 'admin') {
        $state.go('home');
      }

      if ($window.confirm('Are you sure you want to delete this user?')) {
        var user = $scope.user;
        $http.delete('/api/admin/deleteUser/' + user._id, user).then(function (response) {
          onUserDeleteSuccess(response);
        }, function (error) {
          onUserDeleteFailure(error);
        });
      }
    };

    $scope.update = function (isValid) {
      if (vm.authentication.user.type !== 'admin') {
        $state.go('home');
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = $scope.user;

      // CatalogService.sponsorGetStudents().then(onUserUpdateSuccess).catch(onUserUpdateFailure);
      // AdminPowers.adminUpdateUser(user).then(onUserUpdateSuccess).catch(onUserUpdateFailure);

      $http.put('/api/admin/updateUser/' + user._id, user).then(function (response) {
        onUserUpdateSuccess(response);
      }, function (error) {
        onUserUpdateFailure(error);
      });
    };

    function onUserUpdateSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User Updated successfully!' });
    }

    function onUserUpdateFailure(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
    }

    function onUserDeleteSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User Deleted successfully!' });
      $state.go('catalog');
    }

    function onUserDeleteFailure(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User delete error!' });
    }
  }
}());
