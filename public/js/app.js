'use strict';

//Start by defining the main module
angular.module('mean', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.articles']);

//Then define the init function for starting up the application
window.init = function(user) {
	//Initializing the user object
	window.user = user;

    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, ['mean']);
};