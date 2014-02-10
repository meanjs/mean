'use strict';

(function() {
	describe('MEAN controllers', function() {
		describe('HomeController', function() {
			//Initialize global variables
			var scope,
				HomeController;

			// Load the main application module
			beforeEach(module('mean'));

			beforeEach(inject(function($controller, $rootScope) {
				scope = $rootScope.$new();

				HomeController = $controller('HomeController', {
					$scope: scope
				});
			}));

			it('should expose the authentication service', function() {
				expect(scope.authentication).toBeTruthy();
			});
		});
	});
})();