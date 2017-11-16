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
      mockUser,
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
        approvedStatus: false
      });
      newlyApproved = new ApplicantsService({
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
    describe('vm.approveUser() as update', function () {
      var sampleUserPostData;
      var newlyApproved;
      var mockUserList;

      beforeEach(function () {
        // Create a sample item object
        sampleUserPostData = new ApplicantsService({
          roles: ['ta'],
          approvedStatus: false
        });
        mockUserList = [mockUser, mockUser];
        //expect the get request before each of these
        $httpBackend.expectGET('/api/unapproved').respond(mockUserList);
        $httpBackend.flush()

      });

      it('should send a POST request and end up with the same user with an approved value of true', inject(function (ItemsService) {
        //expect the initial get request
        // Set POST response
        $httpBackend.expectPOST('/api/unapproved', newlyApproved).respond(mockUser);

        // Run controller functionality
        $scope.vm.approveUser(mockUser);
        $httpBackend.flush();
      }));

      
    });
    describe('vm.denyUser() as delete', function () {
      var sampleUserPostData;
      var newlyApproved;
      var mockUserList;

      beforeEach(function () {
        // Create a sample item object
        sampleUserPostData = new ApplicantsService({
          roles: ['ta'],
          approvedStatus: false
        });
        mockUserList = [mockUser, mockUser];
        //expect the get request before each of these
        $httpBackend.expectGET('/api/unapproved').respond(mockUserList);
        $httpBackend.flush()

      });

      it('should send a Delete request with the form input values and then locate to new object URL', inject(function (ItemsService) {
        //expect the initial get request
        // expect a delte from the user with the approved status of false and a ta role
        $httpBackend.expectDELETE('/api/unapproved?approvedStatus=false&roles=ta').respond(204);

        // Run controller functionality
        $scope.vm.removeApplicant(mockUser);
        $httpBackend.flush();
      }));
    });
  });
}());
