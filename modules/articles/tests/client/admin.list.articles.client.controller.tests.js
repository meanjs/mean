(function () {
  'use strict';

  describe('Admin Articles List Controller Tests', function () {
    // Initialize global variables
    var ArticlesAdminListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ArticlesService,
      mockArticle;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ArticlesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ArticlesService = _ArticlesService_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/articles/client/views/list-articles.client.view.html').respond(200, '');
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock article
      mockArticle = new ArticlesService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user', 'admin']
      };

      // Initialize the Articles List controller.
      ArticlesAdminListController = $controller('ArticlesAdminListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockArticleList;

      beforeEach(function () {
        mockArticleList = [mockArticle, mockArticle];
      });

      it('should send a GET request and return all articles', inject(function (ArticlesService) {
        // Set POST response
        $httpBackend.expectGET('/api/articles').respond(mockArticleList);
        $httpBackend.when('GET', '/api/users/me').respond(200, 'Fred');

        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.articles.length).toEqual(2);
        expect($scope.vm.articles[0]).toEqual(mockArticle);
        expect($scope.vm.articles[1]).toEqual(mockArticle);

      }));
    });
  });
}());
