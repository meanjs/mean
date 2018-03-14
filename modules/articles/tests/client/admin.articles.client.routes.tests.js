((() => {
  describe('Articles Route Tests', () => {
    // Initialize global variables
    var $scope;

    var ArticlesService;

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
          mainstate = $state.get('admin.articles');
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
          liststate = $state.get('admin.articles.list');
        }));

        it('Should have the correct URL', () => {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', () => {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(liststate.templateUrl).toBe('/modules/articles/client/views/admin/list-articles.client.view.html');
        });
      });

      describe('Create Route', () => {
        var createstate;
        var ArticlesAdminController;
        var mockArticle;

        beforeEach(inject(($controller, $state, $templateCache) => {
          createstate = $state.get('admin.articles.create');
          $templateCache.put('/modules/articles/client/views/admin/form-article.client.view.html', '');

          // Create mock article
          mockArticle = new ArticlesService();

          // Initialize Controller
          ArticlesAdminController = $controller('ArticlesAdminController as vm', {
            $scope,
            articleResolve: mockArticle
          });
        }));

        it('Should have the correct URL', () => {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', () => {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.articleResolve).toEqual('function');
        });

        it('should respond to URL', inject($state => {
          expect($state.href(createstate)).toEqual('/admin/articles/create');
        }));

        it('should attach an article to the controller scope', () => {
          expect($scope.vm.article._id).toBe(mockArticle._id);
          expect($scope.vm.article._id).toBe(undefined);
        });

        it('Should not be abstract', () => {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(createstate.templateUrl).toBe('/modules/articles/client/views/admin/form-article.client.view.html');
        });
      });

      describe('Edit Route', () => {
        var editstate;
        var ArticlesAdminController;
        var mockArticle;

        beforeEach(inject(($controller, $state, $templateCache) => {
          editstate = $state.get('admin.articles.edit');
          $templateCache.put('/modules/articles/client/views/admin/form-article.client.view.html', '');

          // Create mock article
          mockArticle = new ArticlesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Article about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ArticlesAdminController = $controller('ArticlesAdminController as vm', {
            $scope,
            articleResolve: mockArticle
          });
        }));

        it('Should have the correct URL', () => {
          expect(editstate.url).toEqual('/:articleId/edit');
        });

        it('Should have a resolve function', () => {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.articleResolve).toEqual('function');
        });

        it('should respond to URL', inject($state => {
          expect($state.href(editstate, {
            articleId: 1
          })).toEqual('/admin/articles/1/edit');
        }));

        it('should attach an article to the controller scope', () => {
          expect($scope.vm.article._id).toBe(mockArticle._id);
        });

        it('Should not be abstract', () => {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(editstate.templateUrl).toBe('/modules/articles/client/views/admin/form-article.client.view.html');
        });

        xit('Should go to unauthorized route', () => {

        });
      });

    });
  });
})());
