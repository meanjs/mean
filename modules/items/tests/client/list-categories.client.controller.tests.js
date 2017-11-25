(function () {
  'use strict';

  describe('List Categories Controller Tests', function () {
    // Initialize global variables
    var ItemsAdminCategoriesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CategoriesService,
      mockCat,
      newlyApproved;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CategoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CategoriesService = _CategoriesService_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/users/client/views/admin/view-categories.html').respond(200, '');
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock category
      mockCat = new CategoriesService({
        title: 'TestCat'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['admin'],
        approvedStatus: true
      };

      // Initialize the Items Category List controller.
      ItemsAdminCategoriesController = $controller('ItemsAdminCategoriesController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockCatList;

      beforeEach(function () {
        mockCatList = [mockCat, mockCat];
      });

      it('should send a GET request and return all users', inject(function (ItemsService) {
        // Set POST response
        $httpBackend.expectGET('/api/categories').respond(mockCatList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.categories.length).toEqual(2);
        expect($scope.vm.categories[0]).toEqual(mockCat);
        expect($scope.vm.categories[1]).toEqual(mockCat);

      }));
    });
    describe('vm.remove() as delete', function () {
      var sampleUserPostData;
      var newlyApproved;
      var mockCatList;

      beforeEach(function () {
        // Create a sample item object
        mockCatList = [mockCat, mockCat];
        //expect the get request before each of these
        $httpBackend.expectGET('/api/categories').respond(mockCatList);
        $httpBackend.flush()

      });

      it('should send a Delete request with the Categories values', inject(function (ItemsService) {
        //expect the initial get request
        // expect a delte from the user with the title of TestCat
        spyOn(window, 'confirm').and.returnValue(true);
        $httpBackend.expectDELETE('/api/categories?title=TestCat').respond(204);

        // Run controller functionality
        $scope.vm.remove(mockCat);
        $httpBackend.flush();
      }));
    });
  });
}());
