((() => {
  'use strict';

  describe('Articles Route Tests', () => {
    // Initialize global variables
    var $scope,
      ArticlesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(($rootScope, _ArticlesService_) => {
      // Set a new global scope
      $scope = $rootScope.$new();
      ArticlesService = _ArticlesService_;
    }));

    describe('Route Config', () => {
      describe('Main Route', () => {
        var mainstate;
        beforeEach(inject($state => {
          mainstate = $state.get('articles');
        }));

        it('Should have the correct URL', () => {
          expect(mainstate.url).toEqual('/articles');
        });

        it('Should be abstract', () => {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', () => {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', () => {
        var liststate;
        beforeEach(inject($state => {
          liststate = $state.get('articles.list');
        }));

        it('Should have the correct URL', () => {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', () => {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(liststate.templateUrl).toBe('/modules/articles/client/views/list-articles.client.view.html');
        });
      });

      describe('View Route', () => {
        var viewstate,
          ArticlesController,
          mockArticle;

        beforeEach(inject(($controller, $state, $templateCache) => {
          viewstate = $state.get('articles.view');
          $templateCache.put('/modules/articles/client/views/view-article.client.view.html', '');

          // create mock article
          mockArticle = new ArticlesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Article about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ArticlesController = $controller('ArticlesController as vm', {
            $scope,
            articleResolve: mockArticle
          });
        }));

        it('Should have the correct URL', () => {
          expect(viewstate.url).toEqual('/:articleId');
        });

        it('Should have a resolve function', () => {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.articleResolve).toEqual('function');
        });

        it('should respond to URL', inject($state => {
          expect($state.href(viewstate, {
            articleId: 1
          })).toEqual('/articles/1');
        }));

        it('should attach an article to the controller scope', () => {
          expect($scope.vm.article._id).toBe(mockArticle._id);
        });

        it('Should not be abstract', () => {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(viewstate.templateUrl).toBe('/modules/articles/client/views/view-article.client.view.html');
        });
      });

      describe('Handle Trailing Slash', () => {
        beforeEach(inject(($state, $rootScope, $templateCache) => {
          $templateCache.put('/modules/articles/client/views/list-articles.client.view.html', '');

          $state.go('articles.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(($state, $location, $rootScope) => {
          $location.path('articles/');
          $rootScope.$digest();

          expect($location.path()).toBe('/articles');
          expect($state.current.templateUrl).toBe('/modules/articles/client/views/list-articles.client.view.html');
        }));
      });
    });
  });
})());
