(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService', 'tmhDynamicLocale', '$translate', '$cookies'];

  function HeaderController($scope, $state, Authentication, menuService, tmhDynamicLocale, $translate, $cookies) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    vm.language = $translate.preferredLanguage();
    vm.languages = window.application ? window.application.languages : {};

    $scope.changeLanguage = function (language) {

      tmhDynamicLocale.set(language);
      $translate.use(language);

      var now = new Date;
      var expires = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

      $cookies.put('language', language, {
        expires: expires
      });
    };

  }
}());
