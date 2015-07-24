'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
}]).
config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(['$rootScope', '$q', function ($rootScope, $q) {
        return {
            responseError: function(rejection) {
                if (!rejection.config.ignoreAuthModule) {
                    switch (rejection.status) {
                        case 401:
                            $rootScope.$broadcast('event:auth-loginRequired', rejection);
                            break;
                        case 403:
                            $rootScope.$broadcast('event:auth-forbidden', rejection);
                            break;
                    }
                }
                // otherwise, default behaviour
                return $q.reject(rejection);
            }
        };
    }]);
}]);

angular.module(ApplicationConfiguration.applicationModuleName).run(function($rootScope, $state, $modal, Authentication) {

    //Redirect to signin on broadcast event
    $rootScope.$on('event:auth-loginRequired', function (event, args) {
        $state.go('authentication.signin');
    });

    //Redirect to unauthorized on broadcast event
    $rootScope.$on('event:auth-forbidden-redirect', function (event, args) {
        $state.go('unauthorized');
    });

    //Open Unauthorized Modal if forbidden on an api call
    $rootScope.$on('event:auth-forbidden', function (event, args) {
        $modal.open({
            animation: 1,
            templateUrl: '/modules/core/views/modal.client.view.html',
            controller: 'MeanModalController',
            size: 'sm',
            resolve: {
                modal: function () {

                    return {
                        title: 'Forbidden',
                        body: 'You are forbidden to access this resource.',
                        cancel: 0
                    };
                }
            }
        });
    });



    // Check authentication before changing state
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
            var allowed = false;
            toState.data.roles.forEach(function (role) {
               if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
                   allowed = true;
                   return true;
               }
            });

            if (!allowed) {
                event.preventDefault();
                if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
                    $rootScope.$broadcast('event:auth-forbidden-redirect');
                }
                else {
                    $rootScope.$broadcast('event:auth-loginRequired');
                }
            }
        }
    });
});

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
