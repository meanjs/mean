'use strict';
// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function($httpProvider){
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', '$rootScope',
      function($q, $location, $rootScope){
        return {
          responseError: function(rejection){
            switch(rejection.status) {
              case 401:
                //Authentication.user = null;
                // Redirect to signin page

                $rootScope.$broadcast('event:auth-login_required');
                //$location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);
