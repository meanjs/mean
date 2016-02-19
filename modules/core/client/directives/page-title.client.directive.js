(function () {
  'use strict';

  angular.module('core')
    .directive('pageTitle', pageTitle);

  pageTitle.$inject = ['$rootScope', '$interpolate', '$state'];

  function pageTitle($rootScope, $interpolate, $state) {
    var directive = {
      retrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element) {
      $rootScope.$on('$stateChangeSuccess', listener);

      function listener(event, toState) {
        var applicationCoreTitle = 'MEAN.js',
          separeteBy = ' - ';
        if (toState.data && toState.data.pageTitle) {
          var stateTitle = $interpolate(toState.data.pageTitle)($state.$current.locals.globals);
          element.html(applicationCoreTitle + separeteBy + stateTitle);
        } else {
          element.html(applicationCoreTitle);
        }
      }
    }
  }
})();
