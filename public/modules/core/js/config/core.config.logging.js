'use strict';
angular.module('core').config(['logExProvider', function(logExProvider) {

    logExProvider.enableLogging(true);

    logExProvider.overrideLogPrefix(function (className) {
        var $injector = angular.injector([ 'ng' ]);
        var $filter = $injector.get( '$filter' );
        var separator = ' | ';
        var format = 'MMMM-dd-yyyy-h:mm:ssa';
        var now = $filter('date')(new Date(), format);
        return '' + now + (!angular.isString(className) ? '' : '::' + className) + separator;
    });
}]);
