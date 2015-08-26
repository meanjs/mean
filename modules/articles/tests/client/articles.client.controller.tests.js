'use strict';

(function () {
  // Articles Controller Spec
  describe('Articles Controller Tests', function () {
    // Initialize global variables
    var ArticlesController,
      scope,
      rootScope,
      $httpBackend,
      $stateParams,
      $location,
      templateCache,
      $state,
      Authentication,
      Articles,
      mockArticle,
      injector;

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
    beforeEach(inject(function ($controller, $rootScope, _$injector_, _$location_, _$state_, _$stateParams_, _$templateCache_, _$httpBackend_, _Authentication_, _Articles_) {
      // Set a new global scope
      scope = $rootScope.$new();
      rootScope = $rootScope;

      rootScope.$on('$stateChangeError', function (err) {
        console.log(err);
      });

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      $state = _$state_;
      Authentication = _Authentication_;
      Articles = _Articles_;
      templateCache = _$templateCache_;
      injector = _$injector_;


      // create mock article
      mockArticle = new Articles({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Articles controller.
      ArticlesController = $controller('ArticlesController', {
        $scope: scope,
        article: {}
      });

      //Spy on state go
      spyOn($state, 'go');



    }));





    describe('$scope.create()', function () {
      var sampleArticlePostData;

      beforeEach(function () {
        // Create a sample article object
        sampleArticlePostData = new Articles({
          title: 'An Article about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Article about MEAN';
        scope.content = 'MEAN rocks!';
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Articles) {
        // Set POST response
        $httpBackend.expectPOST('api/articles', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the article was created
        expect($state.go).toHaveBeenCalledWith('articles.view', {articleId: mockArticle._id});
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/articles', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock article in scope
        scope.article = mockArticle;
      });

      it('should update a valid article', inject(function (Articles) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/articles\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('articles.view', {articleId: mockArticle._id});
      }));

      it('should set scope.error to error response message', inject(function (Articles) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/articles\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        //Setup articles
        scope.article = mockArticle;
        scope.articles = [mockArticle, {}, {}];
      });

      it('should delete the article and redirect to articles', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/articles\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('articles.list');
        expect(scope.articles.length).toBe(2);
      });

      it('should should not delete the article and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        scope.remove();

        expect($state.go).not.toHaveBeenCalled();
        expect(scope.articles.length).toBe(3);
      });
    });
  });
}());
