(function () {
  'use strict';

  describe('Categories Controller Tests', function () {
    // Initialize global variables
    var CatsController,
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
      $httpBackend.whenGET('/modules/users/client/views/admin/form-categories.html').respond(200, '');
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
      CatsController = $controller('CatsController as vm', {
        $scope: $scope,
        catResolve: {},
        cat: mockCat
      });
       $scope.vm.cat = mockCat;

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.create() as create', function () {
      var sampleCatPostData;
      var newlyApproved;
      var mockCatList;
      it('should send a POST request with the Categories values', inject(function (ItemsService) {
        //expect the initial get request
        // expect a delte from the user with the title of TestCat
        spyOn(window, 'confirm').and.returnValue(true);
        $httpBackend.expectPOST('/api/categories').respond(204);

        // Run controller functionality
        $scope.vm.create();
        $httpBackend.flush();
      }));
    });
  });
}());
