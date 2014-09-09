'use strict';

(function() {
	// Timesheets Controller Spec
	describe('Timesheets Controller Tests', function() {
		// Initialize global variables
		var TimesheetsController,
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

			// Initialize the Timesheets controller.
			TimesheetsController = $controller('TimesheetsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Timesheet object fetched from XHR', inject(function(Timesheets) {
			// Create sample Timesheet using the Timesheets service
			var sampleTimesheet = new Timesheets({
				name: 'New Timesheet'
			});

			// Create a sample Timesheets array that includes the new Timesheet
			var sampleTimesheets = [sampleTimesheet];

			// Set GET response
			$httpBackend.expectGET('timesheets').respond(sampleTimesheets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.timesheets).toEqualData(sampleTimesheets);
		}));

		it('$scope.findOne() should create an array with one Timesheet object fetched from XHR using a timesheetId URL parameter', inject(function(Timesheets) {
			// Define a sample Timesheet object
			var sampleTimesheet = new Timesheets({
				name: 'New Timesheet'
			});

			// Set the URL parameter
			$stateParams.timesheetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/timesheets\/([0-9a-fA-F]{24})$/).respond(sampleTimesheet);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.timesheet).toEqualData(sampleTimesheet);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Timesheets) {
			// Create a sample Timesheet object
			var sampleTimesheetPostData = new Timesheets({
				name: 'New Timesheet'
			});

			// Create a sample Timesheet response
			var sampleTimesheetResponse = new Timesheets({
				_id: '525cf20451979dea2c000001',
				name: 'New Timesheet'
			});

			// Fixture mock form input values
			scope.name = 'New Timesheet';

			// Set POST response
			$httpBackend.expectPOST('timesheets', sampleTimesheetPostData).respond(sampleTimesheetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Timesheet was created
			expect($location.path()).toBe('/timesheets/' + sampleTimesheetResponse._id);
		}));

		it('$scope.update() should update a valid Timesheet', inject(function(Timesheets) {
			// Define a sample Timesheet put data
			var sampleTimesheetPutData = new Timesheets({
				_id: '525cf20451979dea2c000001',
				name: 'New Timesheet'
			});

			// Mock Timesheet in scope
			scope.timesheet = sampleTimesheetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/timesheets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/timesheets/' + sampleTimesheetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid timesheetId and remove the Timesheet from the scope', inject(function(Timesheets) {
			// Create new Timesheet object
			var sampleTimesheet = new Timesheets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Timesheets array and include the Timesheet
			scope.timesheets = [sampleTimesheet];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/timesheets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTimesheet);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.timesheets.length).toBe(0);
		}));
	});
}());