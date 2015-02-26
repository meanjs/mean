'use strict';

(function() {
	// Articles Controller Spec
	describe('ArticlesEditController', function() {
		// Initialize global variables
		var ArticlesEditController,
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

			// Define a sample article object
			sampleArticle = new Articles({
				title: 'An Article about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.articleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/articles\/([0-9a-fA-F]{24})$/).respond(sampleArticle);

			// Initialize the Articles controller.
			ArticlesEditController = $controller('ArticlesEditController', {
				$scope: scope
			});
		}));

		it('$scope.findOne() should create an array with one article object fetched from XHR using a articleId URL parameter', inject(function(Articles) {
			$httpBackend.flush();

			// Test scope value
			expect(scope.article).toEqualData(sampleArticle);
		}));

		it('$scope.update() should update a valid article', inject(function(Articles) {
			// Define a sample article put data
			var sampleArticlePutData = new Articles({
				_id: '525cf20451979dea2c000001',
				title: 'An Article about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock article in scope
			scope.article = sampleArticlePutData;

			// Set PUT response
			$httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/articles/' + sampleArticlePutData._id);
		}));
	});
}());