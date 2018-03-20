((() => {
  describe('Articles Admin Controller Tests', () => {
    // Initialize global variables
    let ArticlesAdminController;

    let $scope;
    let $httpBackend;
    let $state;
    let Authentication;
    let ArticlesService;
    let mockArticle;
    let Notification;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(() => {
      jasmine.addMatchers({
        toEqualData(util, customEqualityTesters) {
          return {
            compare(actual, expected) {
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
    beforeEach(inject((
      $controller,
      $rootScope,
      _$state_,
      _$httpBackend_,
      _Authentication_,
      _ArticlesService_,
      _Notification_
    ) => {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ArticlesService = _ArticlesService_;
      Notification = _Notification_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock article
      mockArticle = new ArticlesService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Articles controller.
      ArticlesAdminController = $controller('ArticlesAdminController as vm', {
        $scope,
        articleResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
      spyOn(Notification, 'error');
      spyOn(Notification, 'success');
    }));

    describe('vm.save() as create', () => {
      let sampleArticlePostData;

      beforeEach(() => {
        // Create a sample article object
        sampleArticlePostData = new ArticlesService({
          title: 'An Article about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.article = sampleArticlePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(ArticlesService => {
        // Set POST response
        $httpBackend.expectPOST('/api/articles', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
        // Test URL redirection after the article was created
        expect($state.go).toHaveBeenCalledWith('admin.articles.list');
      }));

      it('should call Notification.error if error', () => {
        const errorMessage = 'this is an error message';
        $httpBackend.expectPOST('/api/articles', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Article save error!' });
      });
    });

    describe('vm.save() as update', () => {
      beforeEach(() => {
        // Mock article in $scope
        $scope.vm.article = mockArticle;
      });

      it('should update a valid article', inject(ArticlesService => {
        // Set PUT response
        $httpBackend.expectPUT(/api\/articles\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.articles.list');
      }));

      it('should  call Notification.error if error', inject(ArticlesService => {
        const errorMessage = 'error';
        $httpBackend.expectPUT(/api\/articles\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Article save error!' });
      }));
    });

    describe('vm.remove()', () => {
      beforeEach(() => {
        // Setup articles
        $scope.vm.article = mockArticle;
      });

      it('should delete the article and redirect to articles', () => {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/articles\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Article deleted successfully!' });
        expect($state.go).toHaveBeenCalledWith('admin.articles.list');
      });

      it('should should not delete the article and not redirect', () => {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})());
