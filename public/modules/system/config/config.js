'use strict';

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
])

//Config HTTP Error Handling
angular.module('mean').config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$location', 'Global',
            function($q, $location, Global) {
                return {
                    responseError: function(rejection) {
                        switch (rejection.status) {
                            case 401:
                            	//Deauthenticate the global user
                            	Global.user = null;

                            	//Redirect to signin page
                                $location.path('signin');
                                break;
                            case 403:
                                //Add unauthorized behaviour 
                                break;
                        }

                        return $q.reject(rejection);
                    }
                };
            }
        ]);
    }
]);;