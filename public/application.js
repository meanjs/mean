'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('!');
}])
.constant('$preloadProvider', {})
.config(['$preloadProvider', function($preloadProvider) {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        if (script.type === 'text/preloaded') {
            var data = JSON.parse(script.innerHTML);
            if (script.hasAttribute('name')) {
                $preloadProvider[script.getAttribute('name')] = data;
            } else {
                angular.extend($preloadProvider, data);
            }
        }
    }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
