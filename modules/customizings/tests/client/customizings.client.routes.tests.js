(function () {
  'use strict';

  describe('Customizings Route Tests', function () {
    // Initialize global variables
    var $scope,
      CustomizingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CustomizingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CustomizingsService = _CustomizingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('customizings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/customizings');
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
          CustomizingsController,
          mockCustomizing;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('customizings.view');
          $templateCache.put('modules/customizings/client/views/view-customizing.client.view.html', '');

          // create mock Customizing
          mockCustomizing = new CustomizingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Customizing Name'
          });

          // Initialize Controller
          CustomizingsController = $controller('CustomizingsController as vm', {
            $scope: $scope,
            customizingResolve: mockCustomizing
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:customizingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.customizingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            customizingId: 1
          })).toEqual('/customizings/1');
        }));

        it('should attach an Customizing to the controller scope', function () {
          expect($scope.vm.customizing._id).toBe(mockCustomizing._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/customizings/client/views/view-customizing.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CustomizingsController,
          mockCustomizing;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('customizings.create');
          $templateCache.put('modules/customizings/client/views/form-customizing.client.view.html', '');

          // create mock Customizing
          mockCustomizing = new CustomizingsService();

          // Initialize Controller
          CustomizingsController = $controller('CustomizingsController as vm', {
            $scope: $scope,
            customizingResolve: mockCustomizing
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.customizingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/customizings/create');
        }));

        it('should attach an Customizing to the controller scope', function () {
          expect($scope.vm.customizing._id).toBe(mockCustomizing._id);
          expect($scope.vm.customizing._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/customizings/client/views/form-customizing.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CustomizingsController,
          mockCustomizing;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('customizings.edit');
          $templateCache.put('modules/customizings/client/views/form-customizing.client.view.html', '');

          // create mock Customizing
          mockCustomizing = new CustomizingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Customizing Name'
          });

          // Initialize Controller
          CustomizingsController = $controller('CustomizingsController as vm', {
            $scope: $scope,
            customizingResolve: mockCustomizing
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:customizingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.customizingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            customizingId: 1
          })).toEqual('/customizings/1/edit');
        }));

        it('should attach an Customizing to the controller scope', function () {
          expect($scope.vm.customizing._id).toBe(mockCustomizing._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/customizings/client/views/form-customizing.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
