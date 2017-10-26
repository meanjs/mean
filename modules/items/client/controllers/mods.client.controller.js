(function () {
  'use strict';

  angular
    .module('items.mods')
    .controller('ModsController', ModsController);

  ModsController.$inject = ['$scope', '$state', '$window', 'itemResolve', 'Authentication', 'Notification'];

  function ModsController($scope, $state, $window, item, Authentication, Notification) {
    

  }
}());
