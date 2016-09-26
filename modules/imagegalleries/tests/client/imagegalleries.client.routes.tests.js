(function () {
  'use strict';

  describe('Imagegalleries Route Tests', function () {
    // Initialize global variables
    var $scope,
      ImagegalleriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ImagegalleriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ImagegalleriesService = _ImagegalleriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('imagegalleries');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/imagegalleries');
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
          ImagegalleriesController,
          mockImagegallery;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('imagegalleries.view');
          $templateCache.put('modules/imagegalleries/client/views/view-imagegallery.client.view.html', '');

          // create mock Imagegallery
          mockImagegallery = new ImagegalleriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Imagegallery Name'
          });

          // Initialize Controller
          ImagegalleriesController = $controller('ImagegalleriesController as vm', {
            $scope: $scope,
            imagegalleryResolve: mockImagegallery
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:imagegalleryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.imagegalleryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            imagegalleryId: 1
          })).toEqual('/imagegalleries/1');
        }));

        it('should attach an Imagegallery to the controller scope', function () {
          expect($scope.vm.imagegallery._id).toBe(mockImagegallery._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/imagegalleries/client/views/view-imagegallery.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ImagegalleriesController,
          mockImagegallery;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('imagegalleries.create');
          $templateCache.put('modules/imagegalleries/client/views/form-imagegallery.client.view.html', '');

          // create mock Imagegallery
          mockImagegallery = new ImagegalleriesService();

          // Initialize Controller
          ImagegalleriesController = $controller('ImagegalleriesController as vm', {
            $scope: $scope,
            imagegalleryResolve: mockImagegallery
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.imagegalleryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/imagegalleries/create');
        }));

        it('should attach an Imagegallery to the controller scope', function () {
          expect($scope.vm.imagegallery._id).toBe(mockImagegallery._id);
          expect($scope.vm.imagegallery._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/imagegalleries/client/views/form-imagegallery.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ImagegalleriesController,
          mockImagegallery;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('imagegalleries.edit');
          $templateCache.put('modules/imagegalleries/client/views/form-imagegallery.client.view.html', '');

          // create mock Imagegallery
          mockImagegallery = new ImagegalleriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Imagegallery Name'
          });

          // Initialize Controller
          ImagegalleriesController = $controller('ImagegalleriesController as vm', {
            $scope: $scope,
            imagegalleryResolve: mockImagegallery
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:imagegalleryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.imagegalleryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            imagegalleryId: 1
          })).toEqual('/imagegalleries/1/edit');
        }));

        it('should attach an Imagegallery to the controller scope', function () {
          expect($scope.vm.imagegallery._id).toBe(mockImagegallery._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/imagegalleries/client/views/form-imagegallery.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
