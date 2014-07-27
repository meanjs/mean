'use strict';

(function() {
	// Qas Controller Spec
	describe('Qas Controller Tests', function() {
		// Initialize global variables
		var QasController,
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

			// Initialize the Qas controller.
			QasController = $controller('QasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Qa object fetched from XHR', inject(function(Qas) {
			// Create sample Qa using the Qas service
			var sampleQa = new Qas({
				name: 'New Qa'
			});

			// Create a sample Qas array that includes the new Qa
			var sampleQas = [sampleQa];

			// Set GET response
			$httpBackend.expectGET('qas').respond(sampleQas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.qas).toEqualData(sampleQas);
		}));

		it('$scope.findOne() should create an array with one Qa object fetched from XHR using a qaId URL parameter', inject(function(Qas) {
			// Define a sample Qa object
			var sampleQa = new Qas({
				name: 'New Qa'
			});

			// Set the URL parameter
			$stateParams.qaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/qas\/([0-9a-fA-F]{24})$/).respond(sampleQa);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.qa).toEqualData(sampleQa);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Qas) {
			// Create a sample Qa object
			var sampleQaPostData = new Qas({
				name: 'New Qa'
			});

			// Create a sample Qa response
			var sampleQaResponse = new Qas({
				_id: '525cf20451979dea2c000001',
				name: 'New Qa'
			});

			// Fixture mock form input values
			scope.name = 'New Qa';

			// Set POST response
			$httpBackend.expectPOST('qas', sampleQaPostData).respond(sampleQaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Qa was created
			expect($location.path()).toBe('/qas/' + sampleQaResponse._id);
		}));

		it('$scope.update() should update a valid Qa', inject(function(Qas) {
			// Define a sample Qa put data
			var sampleQaPutData = new Qas({
				_id: '525cf20451979dea2c000001',
				name: 'New Qa'
			});

			// Mock Qa in scope
			scope.qa = sampleQaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/qas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/qas/' + sampleQaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid qaId and remove the Qa from the scope', inject(function(Qas) {
			// Create new Qa object
			var sampleQa = new Qas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Qas array and include the Qa
			scope.qas = [sampleQa];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/qas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleQa);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.qas.length).toBe(0);
		}));
	});
}());