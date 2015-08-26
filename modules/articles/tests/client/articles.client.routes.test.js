'use strict';

(function () {
  // Articles Controller Spec
  describe('Articles Route Tests', function () {
    // Initialize global variables
    var scope,
      rootScope,
      ArticlesController,
      Articles,
      mockArticle;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _Articles_) {
      // Set a new global scope
      scope = $rootScope.$new();
      rootScope = $rootScope;
      Articles = _Articles_;

      // create mock article
      mockArticle = new Articles({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });

      //Initialize Controller
      ArticlesController = $controller('ArticlesController', {
        $scope: scope,
        article: mockArticle
      });
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('articles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/articles');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate;
        beforeEach(inject(function ($state, $templateCache) {
          viewstate = $state.get('articles.view');
          $templateCache.put('modules/articles/client/views/view-article.client.view.html', '');
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:articleId');
        });

        it('Should have a resolve function', function () {
          expect( typeof viewstate.resolve).toEqual('object');
          expect( typeof viewstate.resolve.article).toEqual('function');
        });

        //TODO:  Would like to see a test that checks to make sure the resove is correct with mockArticle

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, { articleId: 1 })).toEqual('/articles/1');
        }));
        /*
        TODO:  Someone needs to make this test work.  I can't figure out how to get the route to actually resolve
        it('should should transition to article.view', inject(function ($state, $rootScope, $httpBackend) {
          $httpBackend.expectGET('api/articles/' + mockArticle._id).respond(mockArticle);

          $state.go('articles.view', {articleId: mockArticle._id});
          $rootScope.$apply();
          expect($state.current.name).toBe('articles.view');
        }));
        */
        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/articles/client/views/view.article.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate;
        beforeEach(inject(function ($state, $templateCache) {
          createstate = $state.get('articles.create');
          $templateCache.put('modules/articles/client/views/create.article.client.view.html', '');
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect( typeof createstate.resolve).toEqual('object');
          expect( typeof createstate.resolve.article).toEqual('function');
        });

        //TODO:  Would like to see a test that checks to make sure the resove is correct with mockArticle

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/articles/create');
        }));
        /*
        TODO:  Someone needs to make this test work.  I can't figure out how to get the route to actually resolve
        it('should should transition to article.view', inject(function ($state, $rootScope, $httpBackend) {
          $httpBackend.expectGET('api/articles/' + mockArticle._id).respond(mockArticle);

          $state.go('articles.view', {articleId: mockArticle._id});
          $rootScope.$apply();
          expect($state.current.name).toBe('articles.view');
        }));
        */
        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/articles/client/views/create.article.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate;
        beforeEach(inject(function ($state, $templateCache) {
          editstate = $state.get('articles.edit');
          $templateCache.put('modules/articles/client/views/edit.article.client.view.html', '');
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:articleId/edit');
        });

        it('Should have a resolve function', function () {
          expect( typeof editstate.resolve).toEqual('object');
          expect( typeof editstate.resolve.article).toEqual('function');
        });

        //TODO:  Would like to see a test that checks to make sure the resove is correct with mockArticle

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, { articleId: 1 })).toEqual('/articles/1/edit');
        }));
        /*
        TODO:  Someone needs to make this test work.  I can't figure out how to get the route to actually resolve
        it('should should transition to article.view', inject(function ($state, $rootScope, $httpBackend) {
          $httpBackend.expectGET('api/articles/' + mockArticle._id).respond(mockArticle);

          $state.go('articles.view', {articleId: mockArticle._id});
          $rootScope.$apply();
          expect($state.current.name).toBe('articles.view');
        }));
        */
        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/articles/client/views/edit.article.client.view.html');
        });

        //TODO:  Would like to see a test that checks fails authentiaction and makes sure it goes to unauthorized route

      });

    });
  });
}());
