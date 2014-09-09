'use strict';

(function() {
	// Vendors Controller Spec
	describe('Vendors Controller Tests', function() {
		// Initialize global variables
		var VendorsController,
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

			// Initialize the Vendors controller.
			VendorsController = $controller('VendorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Vendor object fetched from XHR', inject(function(Vendors) {
			// Create sample Vendor using the Vendors service
			var sampleVendor = new Vendors({
				name: 'New Vendor'
			});

			// Create a sample Vendors array that includes the new Vendor
			var sampleVendors = [sampleVendor];

			// Set GET response
			$httpBackend.expectGET('vendors').respond(sampleVendors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vendors).toEqualData(sampleVendors);
		}));

		it('$scope.findOne() should create an array with one Vendor object fetched from XHR using a vendorId URL parameter', inject(function(Vendors) {
			// Define a sample Vendor object
			var sampleVendor = new Vendors({
				name: 'New Vendor'
			});

			// Set the URL parameter
			$stateParams.vendorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/vendors\/([0-9a-fA-F]{24})$/).respond(sampleVendor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vendor).toEqualData(sampleVendor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Vendors) {
			// Create a sample Vendor object
			var sampleVendorPostData = new Vendors({
				name: 'New Vendor'
			});

			// Create a sample Vendor response
			var sampleVendorResponse = new Vendors({
				_id: '525cf20451979dea2c000001',
				name: 'New Vendor'
			});

			// Fixture mock form input values
			scope.name = 'New Vendor';

			// Set POST response
			$httpBackend.expectPOST('vendors', sampleVendorPostData).respond(sampleVendorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Vendor was created
			expect($location.path()).toBe('/vendors/' + sampleVendorResponse._id);
		}));

		it('$scope.update() should update a valid Vendor', inject(function(Vendors) {
			// Define a sample Vendor put data
			var sampleVendorPutData = new Vendors({
				_id: '525cf20451979dea2c000001',
				name: 'New Vendor'
			});

			// Mock Vendor in scope
			scope.vendor = sampleVendorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/vendors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/vendors/' + sampleVendorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid vendorId and remove the Vendor from the scope', inject(function(Vendors) {
			// Create new Vendor object
			var sampleVendor = new Vendors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Vendors array and include the Vendor
			scope.vendors = [sampleVendor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/vendors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVendor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.vendors.length).toBe(0);
		}));
	});
}());