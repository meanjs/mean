(function () {
  'use strict';

  angular
    .module('users')
    .controller('StudentController', StudentController);

  StudentController.$inject = ['$scope', '$state', '$http', '$stateParams', 'Authentication', '$window', '$location', 'ProfileService', 'Notification'];

  function StudentController($scope, $state, $http, $stateParams, Authentication, $window, $location, ProfileService, Notification) {
    var vm = this;

    vm.authentication = Authentication;

    if (vm.authentication.user === null) {
      $state.go('authentication.signin');
    }
    if (vm.authentication.user.type !== 'sponsor' && vm.authentication.user.type !== 'admin') {
      if (vm.authentication.type === 'student') {
        $state.go('profile');
      } else {
        $state.go('home');
      }
    }

    loadUser();

    function loadUser() {
      if ($stateParams.student !== null && $stateParams.student !== undefined) {
        vm.user = $stateParams.student;
      } else if ($window.student !== null && $window.student !== undefined) {
        vm.user = $window.student;
      } else if ($location.search().username) {
        var username = $location.search().username;
        ProfileService.getProfileWithUsername(username).then(onGetProfileSuccess).catch(onGetProfileFailure);
      } else {
        Notification.error({ message: 'Could not load student profile' });
      }
    }

    function onGetProfileSuccess(response) {
      vm.user = response;
    }

    function onGetProfileFailure(response) {
      Notification.error({ message: 'Could not load student profile' });
    }
  }
}());
