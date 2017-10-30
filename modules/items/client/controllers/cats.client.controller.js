(function () {
  'use strict';

  angular
    .module('items.cats')
    .controller('CatsController', CatsController);

  CatsController.$inject = ['$scope', '$state', '$window', 'catResolve', 'Authentication', 'Notification'];

  function CatsController($scope, $state, $window, cat, Authentication, Notification) {
    var vm = this;

    vm.cat = cat;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

  }
}());
