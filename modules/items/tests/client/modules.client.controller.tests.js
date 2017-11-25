(function () {
  'use strict';

  describe('Modules Controller Tests', function () {
    // Initialize global variables
    var ModsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ModulesService,
      mockMod,
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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ModulesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ModulesService = _ModulesService_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/users/client/views/admin/form-modules.html').respond(200, '');
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock Module
      mockMod = new ModulesService({
        title: 'TestMod'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['admin'],
        approvedStatus: true
      };

      // Initialize the Items Module controller.
      ModsController = $controller('ModsController as vm', {
        $scope: $scope,
        modResolve: {},
        mod: mockMod
      });
       $scope.vm.mod = mockMod;

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.create() as create', function () {
      it('should send a POST request with the Module values', inject(function (ItemsService) {
        // expect a Post from the user
        spyOn(window, 'confirm').and.returnValue(true);
        $httpBackend.expectPOST('/api/modules').respond(204);

        // Run controller functionality
        $scope.vm.create();
        $httpBackend.flush();
      }));
    });
  });
}());
