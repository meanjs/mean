'use strict';

(function() {
	// Takers Controller Spec
	describe('Takers Controller Tests', function() {
		// Initialize global variables
		var TakersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Takers controller.
			TakersController = $controller('TakersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Taker object fetched from XHR', inject(function(Takers) {
			// Create sample Taker using the Takers service
			var sampleTaker = new Takers({
				name: 'New Taker'
			});

			// Create a sample Takers array that includes the new Taker
			var sampleTakers = [sampleTaker];

			// Set GET response
			$httpBackend.expectGET('takers').respond(sampleTakers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.takers).toEqualData(sampleTakers);
		}));

		it('$scope.findOne() should create an array with one Taker object fetched from XHR using a takerId URL parameter', inject(function(Takers) {
			// Define a sample Taker object
			var sampleTaker = new Takers({
				name: 'New Taker'
			});

			// Set the URL parameter
			$stateParams.takerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/takers\/([0-9a-fA-F]{24})$/).respond(sampleTaker);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.taker).toEqualData(sampleTaker);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Takers) {
			// Create a sample Taker object
			var sampleTakerPostData = new Takers({
				name: 'New Taker'
			});

			// Create a sample Taker response
			var sampleTakerResponse = new Takers({
				_id: '525cf20451979dea2c000001',
				name: 'New Taker'
			});

			// Fixture mock form input values
			scope.name = 'New Taker';

			// Set POST response
			$httpBackend.expectPOST('takers', sampleTakerPostData).respond(sampleTakerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Taker was created
			expect($location.path()).toBe('/takers/' + sampleTakerResponse._id);
		}));

		it('$scope.update() should update a valid Taker', inject(function(Takers) {
			// Define a sample Taker put data
			var sampleTakerPutData = new Takers({
				_id: '525cf20451979dea2c000001',
				name: 'New Taker'
			});

			// Mock Taker in scope
			scope.taker = sampleTakerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/takers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/takers/' + sampleTakerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid takerId and remove the Taker from the scope', inject(function(Takers) {
			// Create new Taker object
			var sampleTaker = new Takers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Takers array and include the Taker
			scope.takers = [sampleTaker];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/takers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTaker);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.takers.length).toBe(0);
		}));
	});
}());