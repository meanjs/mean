'use strict';

(function() {
	describe('MEAN controllers', function() {
		describe('HeaderController', function() {
			//Initialize global variables
			var scope,
				HeaderController;

			// Load the main application module
			beforeEach(module('mean'));

			beforeEach(inject(function($controller, $rootScope) {
				scope = $rootScope.$new();

				HeaderController = $controller('HeaderController', {
					$scope: scope
				});
			}));

			it('should expose the authentication service', function() {
				expect(scope.authentication).toBeTruthy();
			});
		});
	});
})();