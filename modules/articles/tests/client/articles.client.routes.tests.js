(function () {
  'use strict';

  describe('Articles Route Tests', function () {
    // Initialize global variables
    var $scope,
      ArticlesService;

    //We can start by loading the main application module
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

      describe('View Route', function () {
        var viewstate,
          ArticlesController,
          mockArticle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('articles.view');
          $templateCache.put('/modules/articles/client/views/view-article.client.view.html', '');

          // create mock article
          mockArticle = new ArticlesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Article about MEAN',
            content: 'MEAN rocks!'
          });

          //Initialize Controller
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
          expect(viewstate.templateUrl).toBe('/modules/articles/client/views/view-article.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ArticlesController,
          mockArticle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('articles.create');
          $templateCache.put('/modules/articles/client/views/form-article.client.view.html', '');

          // create mock article
          mockArticle = new ArticlesService();

          //Initialize Controller
          ArticlesController = $controller('ArticlesController as vm', {
            $scope: $scope,
            articleResolve: mockArticle
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.articleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/articles/create');
        }));

        it('should attach an article to the controller scope', function () {
          expect($scope.vm.article._id).toBe(mockArticle._id);
          expect($scope.vm.article._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/articles/client/views/form-article.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ArticlesController,
          mockArticle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('articles.edit');
          $templateCache.put('/modules/articles/client/views/form-article.client.view.html', '');

          // create mock article
          mockArticle = new ArticlesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Article about MEAN',
            content: 'MEAN rocks!'
          });

          //Initialize Controller
          ArticlesController = $controller('ArticlesController as vm', {
            $scope: $scope,
            articleResolve: mockArticle
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:articleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.articleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            articleId: 1
          })).toEqual('/articles/1/edit');
        }));

        it('should attach an article to the controller scope', function () {
          expect($scope.vm.article._id).toBe(mockArticle._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/articles/client/views/form-article.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
