'use strict';

(function() {
	// Invoices Controller Spec
	describe('Invoices Controller Tests', function() {
		// Initialize global variables
		var InvoicesController,
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

			// Initialize the Invoices controller.
			InvoicesController = $controller('InvoicesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Invoice object fetched from XHR', inject(function(Invoices) {
			// Create sample Invoice using the Invoices service
			var sampleInvoice = new Invoices({
				name: 'New Invoice'
			});

			// Create a sample Invoices array that includes the new Invoice
			var sampleInvoices = [sampleInvoice];

			// Set GET response
			$httpBackend.expectGET('invoices').respond(sampleInvoices);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.invoices).toEqualData(sampleInvoices);
		}));

		it('$scope.findOne() should create an array with one Invoice object fetched from XHR using a invoiceId URL parameter', inject(function(Invoices) {
			// Define a sample Invoice object
			var sampleInvoice = new Invoices({
				name: 'New Invoice'
			});

			// Set the URL parameter
			$stateParams.invoiceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/invoices\/([0-9a-fA-F]{24})$/).respond(sampleInvoice);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.invoice).toEqualData(sampleInvoice);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Invoices) {
			// Create a sample Invoice object
			var sampleInvoicePostData = new Invoices({
				name: 'New Invoice'
			});

			// Create a sample Invoice response
			var sampleInvoiceResponse = new Invoices({
				_id: '525cf20451979dea2c000001',
				name: 'New Invoice'
			});

			// Fixture mock form input values
			scope.name = 'New Invoice';

			// Set POST response
			$httpBackend.expectPOST('invoices', sampleInvoicePostData).respond(sampleInvoiceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Invoice was created
			expect($location.path()).toBe('/invoices/' + sampleInvoiceResponse._id);
		}));

		it('$scope.update() should update a valid Invoice', inject(function(Invoices) {
			// Define a sample Invoice put data
			var sampleInvoicePutData = new Invoices({
				_id: '525cf20451979dea2c000001',
				name: 'New Invoice'
			});

			// Mock Invoice in scope
			scope.invoice = sampleInvoicePutData;

			// Set PUT response
			$httpBackend.expectPUT(/invoices\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/invoices/' + sampleInvoicePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid invoiceId and remove the Invoice from the scope', inject(function(Invoices) {
			// Create new Invoice object
			var sampleInvoice = new Invoices({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Invoices array and include the Invoice
			scope.invoices = [sampleInvoice];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/invoices\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInvoice);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.invoices.length).toBe(0);
		}));
	});
}());