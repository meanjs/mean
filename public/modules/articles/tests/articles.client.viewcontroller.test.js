'use strict';

(function() {
	// Articles Controller Spec
	describe('ArticlesViewController', function() {
		// Initialize global variables
		var ArticlesViewController,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			sampleArticle;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, Articles) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			
			var articleId = '525a8422f6d0f87f0e407a33';
			
			// Define a sample article object
			sampleArticle = new Articles({
				title: 'An Article about MEAN',
				content: 'MEAN rocks!',
				_id: articleId
			});

			// Set the URL parameter
			$stateParams.articleId = articleId;

			// Set GET response
			$httpBackend.expectGET(/articles\/([0-9a-fA-F]{24})$/).respond(sampleArticle);

			// Initialize the Articles controller.
			ArticlesViewController = $controller('ArticlesViewController', {
				$scope: scope
			});
		}));

		it('$scope.findOne() should create an array with one article object fetched from XHR using a articleId URL parameter', inject(function(Articles) {
			$httpBackend.flush();

			// Test scope value
			expect(scope.article).toEqualData(sampleArticle);
		}));

		it('$scope.remove() should send a DELETE request with a valid articleId and remove the article from the scope', inject(function(Articles) {
			// Create new articles array and include the article
			scope.articles = [sampleArticle];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/articles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleArticle);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.articles.length).toBe(0);
		}));
	});
}());