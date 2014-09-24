'use strict';

(function() {
	// Quizzes Controller Spec
	describe('Quizzes Controller Tests', function() {
		// Initialize global variables
		var QuizzesController,
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

			// Initialize the Quizzes controller.
			QuizzesController = $controller('QuizzesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Quiz object fetched from XHR', inject(function(Quizzes) {
			// Create sample Quiz using the Quizzes service
			var sampleQuiz = new Quizzes({
				name: 'New Quiz'
			});

			// Create a sample Quizzes array that includes the new Quiz
			var sampleQuizzes = [sampleQuiz];

			// Set GET response
			$httpBackend.expectGET('quizzes').respond(sampleQuizzes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.quizzes).toEqualData(sampleQuizzes);
		}));

		it('$scope.findOne() should create an array with one Quiz object fetched from XHR using a quizId URL parameter', inject(function(Quizzes) {
			// Define a sample Quiz object
			var sampleQuiz = new Quizzes({
				name: 'New Quiz'
			});

			// Set the URL parameter
			$stateParams.quizId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/quizzes\/([0-9a-fA-F]{24})$/).respond(sampleQuiz);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.quiz).toEqualData(sampleQuiz);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Quizzes) {
			// Create a sample Quiz object
			var sampleQuizPostData = new Quizzes({
				name: 'New Quiz'
			});

			// Create a sample Quiz response
			var sampleQuizResponse = new Quizzes({
				_id: '525cf20451979dea2c000001',
				name: 'New Quiz'
			});

			// Fixture mock form input values
			scope.name = 'New Quiz';

			// Set POST response
			$httpBackend.expectPOST('quizzes', sampleQuizPostData).respond(sampleQuizResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Quiz was created
			expect($location.path()).toBe('/quizzes/' + sampleQuizResponse._id);
		}));

		it('$scope.update() should update a valid Quiz', inject(function(Quizzes) {
			// Define a sample Quiz put data
			var sampleQuizPutData = new Quizzes({
				_id: '525cf20451979dea2c000001',
				name: 'New Quiz'
			});

			// Mock Quiz in scope
			scope.quiz = sampleQuizPutData;

			// Set PUT response
			$httpBackend.expectPUT(/quizzes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/quizzes/' + sampleQuizPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid quizId and remove the Quiz from the scope', inject(function(Quizzes) {
			// Create new Quiz object
			var sampleQuiz = new Quizzes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Quizzes array and include the Quiz
			scope.quizzes = [sampleQuiz];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/quizzes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleQuiz);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.quizzes.length).toBe(0);
		}));
	});
}());