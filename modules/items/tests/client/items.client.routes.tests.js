(function () {
  'use strict';

  describe('Articles Route Tests', function () {
    // Initialize global variables
    var $scope,
      ArticlesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ArticlesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ArticlesService = _ArticlesService_;
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

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('articles.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/items/client/views/list-items.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ArticlesController,
          mockArticle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('articles.view');
          $templateCache.put('/modules/items/client/views/view-item.client.view.html', '');

          // create mock article
          mockArticle = new ArticlesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Article about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ArticlesController = $controller('ArticlesController as vm', {
            $scope: $scope,
            articleResolve: mockArticle
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:articleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.articleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            articleId: 1
          })).toEqual('/articles/1');
        }));

        it('should attach an article to the controller scope', function () {
          expect($scope.vm.article._id).toBe(mockArticle._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/items/client/views/view-item.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/items/client/views/list-items.client.view.html', '');

          $state.go('articles.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('articles/');
          $rootScope.$digest();

          expect($location.path()).toBe('/articles');
          expect($state.current.templateUrl).toBe('/modules/items/client/views/list-items.client.view.html');
        }));
      });
    });
  });
}());
