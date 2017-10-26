(function () {
  'use strict';

  angular
    .module('items.cats')
    .controller('CatsController', CatsController);

  CatsController.$inject = ['$scope', '$state', '$window', 'itemResolve', 'Authentication', 'Notification'];

  function CatsController($scope, $state, $window, item, Authentication, Notification) {
    

  }
}());
