(function () {
  'use strict';

  describe('HOOO BOY THIS IS WHERE THE ADMIN VIEW CONTROLLER TESTS GO MY FRIEND', function () {
    // Initialize global variables
    var ViewApplicantsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ApplicantsService,
      mockUser;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ApplicantsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ApplicantsService = _ApplicantsService_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/users/client/views/admin/view-applicants.html').respond(200, '');
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock item
      mockUser = new ApplicantsService({
        roles: ['ta'],
        approvedStatus: true
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['admin'],
        approvedStatus: true
      };

      // Initialize the Items List controller.
      ViewApplicantsController = $controller('ViewApplicantsController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockUserList;

      beforeEach(function () {
        mockUserList = [mockUser, mockUser];
      });

      it('should send a GET request and return all users', inject(function (ItemsService) {
        // Set POST response
        $httpBackend.expectGET('/api/unapproved').respond(mockUserList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.unapprovedUsers.length).toEqual(2);
        expect($scope.vm.unapprovedUsers[0]).toEqual(mockUser);
        expect($scope.vm.unapprovedUsers[1]).toEqual(mockUser);

      }));
    });
  });
}());
