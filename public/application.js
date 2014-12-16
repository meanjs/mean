'use strict';

// Is it Google?
var spider = (window.location.search && window.location.search.indexOf('_escaped_fragment_') >= 0);
if (spider && !window.location.hash)
{
	// Append the hash to the URL even if the robot does not request it, otherwise
	// the rendered page is the homepage and not the one requested by ui-router
	var search = window.location.search.match(/_escaped_fragment_=[^&]+/g);
	if (search.length)
	{
		var escapedFragment = search[0].split('=')[1];
		escapedFragment = unescape(escapedFragment); // Facebook crawler escapes these
		var hash = '#!/' + escapedFragment.replace(/^[\/#!]+/,''); // Some crawlers add a forward slash crashing MEAN-SEO
		window.location.href += hash;
	}
}

// Hotmail inbound links suck
if (window.location.hash.indexOf('#%21') === 0)
{
	window.location.href = decodeURIComponent(window.location.href);
}
// Firefox also encodes external links to the site
else if (window.location.href.indexOf('#%21') >= 0)
{
	window.location.href = decodeURIComponent(window.location.href);
}

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});