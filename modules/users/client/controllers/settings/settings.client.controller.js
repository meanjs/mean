(() => {
  angular
    .module('users')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', 'Authentication'];

  function SettingsController($scope, Authentication) {
    const vm = this;

    vm.user = Authentication.user;
  }
})();
