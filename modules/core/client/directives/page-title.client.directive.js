(function() {
  'use strict';

  angular.module('core')
    .directive('pageTitle', pageTitle);

  pageTitle.$inject = ['$rootScope', '$interpolate', '$state'];

  function pageTitle($rootScope, $interpolate, $state) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element) {
      $rootScope.$on('$stateChangeSuccess', listener);

      function listener(event, toState) {
        var applicationCoreTitle = 'MEAN.js',
          separeteBy = ' - ',
          stateTitle = applicationCoreTitle + separeteBy;

        _.forEach(toState.name.split('.'), function(value, index) {
          stateTitle = stateTitle + _.capitalize(value) + separeteBy;
        });
        if (toState.data && toState.data.pageTitle) {
          stateTitle = $interpolate(stateTitle + toState.data.pageTitle + separeteBy)(($state.$current.locals.globals));
        }
        stateTitle = stateTitle.slice(0, -3);
        element.html(stateTitle);
      }
    }
  }
}());
