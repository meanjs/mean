(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', '$location', 'Authentication', 'Notification'];

  function HomeController($scope, $state, $location, Authentication, Notification) {
    var vm = this;

    vm.authentication = Authentication;

    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({ message: $location.search().err });
    }

    // If user is signed in then redirect to appropriate location
    if (vm.authentication.user) {
      if (vm.authentication.user.type === 'student') {
        $state.go('profile');
      } else if (vm.authentication.user.type === 'sponsor' || vm.authentication.user.type === 'admin') {
        $state.go('catalog');
      }
    } else {
      $state.go($state.previous.state.name || 'authentication.signin', $state.previous.params);
    }
  }
}());
