(function () {
  'use strict';

  describe('Edit Profile Controller Tests', function () {
    // Initialize global variables
    var EditProfileController,
      $scope,
      $httpBackend,
      $location,
      Authentication,
      UsersService;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$httpBackend_, _Authentication_, _UsersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      UsersService = _UsersService_;

      // Mock logged in user
      Authentication.user = {
        _id: '525a8422f6d0f87f0e407a33',
        username: 'test',
        roles: ['user']
      };

      // Initialize the Articles controller.
      EditProfileController = $controller('EditProfileController as vm', {
        $scope: $scope
      });
    }));

    describe('Update User Profile', function () {

      it('should have user context', inject(function (UsersService) {
        expect($scope.vm.user).toBe(Authentication.user);
      }));

      it('should update the user profile', inject(function (UsersService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/users/).respond();

        // Run controller functionality
        $scope.vm.updateUserProfile(true);
        $httpBackend.flush();

        expect($scope.vm.success).toBe(true);
      }));

      it('should set vm.error if error', inject(function (UsersService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/users/).respond(400, {
          message: errorMessage
        });

        $scope.vm.updateUserProfile(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

  });
}());
