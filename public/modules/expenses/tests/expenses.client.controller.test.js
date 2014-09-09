'use strict';

(function() {
	// Expenses Controller Spec
	describe('Expenses Controller Tests', function() {
		// Initialize global variables
		var ExpensesController,
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

			// Initialize the Expenses controller.
			ExpensesController = $controller('ExpensesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Expense object fetched from XHR', inject(function(Expenses) {
			// Create sample Expense using the Expenses service
			var sampleExpense = new Expenses({
				name: 'New Expense'
			});

			// Create a sample Expenses array that includes the new Expense
			var sampleExpenses = [sampleExpense];

			// Set GET response
			$httpBackend.expectGET('expenses').respond(sampleExpenses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.expenses).toEqualData(sampleExpenses);
		}));

		it('$scope.findOne() should create an array with one Expense object fetched from XHR using a expenseId URL parameter', inject(function(Expenses) {
			// Define a sample Expense object
			var sampleExpense = new Expenses({
				name: 'New Expense'
			});

			// Set the URL parameter
			$stateParams.expenseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/expenses\/([0-9a-fA-F]{24})$/).respond(sampleExpense);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.expense).toEqualData(sampleExpense);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Expenses) {
			// Create a sample Expense object
			var sampleExpensePostData = new Expenses({
				name: 'New Expense'
			});

			// Create a sample Expense response
			var sampleExpenseResponse = new Expenses({
				_id: '525cf20451979dea2c000001',
				name: 'New Expense'
			});

			// Fixture mock form input values
			scope.name = 'New Expense';

			// Set POST response
			$httpBackend.expectPOST('expenses', sampleExpensePostData).respond(sampleExpenseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Expense was created
			expect($location.path()).toBe('/expenses/' + sampleExpenseResponse._id);
		}));

		it('$scope.update() should update a valid Expense', inject(function(Expenses) {
			// Define a sample Expense put data
			var sampleExpensePutData = new Expenses({
				_id: '525cf20451979dea2c000001',
				name: 'New Expense'
			});

			// Mock Expense in scope
			scope.expense = sampleExpensePutData;

			// Set PUT response
			$httpBackend.expectPUT(/expenses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/expenses/' + sampleExpensePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid expenseId and remove the Expense from the scope', inject(function(Expenses) {
			// Create new Expense object
			var sampleExpense = new Expenses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Expenses array and include the Expense
			scope.expenses = [sampleExpense];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/expenses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleExpense);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.expenses.length).toBe(0);
		}));
	});
}());