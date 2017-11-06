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

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    $scope.update = function (isValid) {
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
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
    }

    function onUserUpdateFailure(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
    }
  }
}());
