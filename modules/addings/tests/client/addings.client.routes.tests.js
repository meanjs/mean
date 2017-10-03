(function () {
  'use strict';

  describe('Addings Route Tests', function () {
    // Initialize global variables
    var $scope,
      AddingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AddingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AddingsService = _AddingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('addings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/addings');
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
          AddingsController,
          mockAdding;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('addings.view');
          $templateCache.put('modules/addings/client/views/view-adding.client.view.html', '');

          // create mock Adding
          mockAdding = new AddingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adding Name'
          });

          // Initialize Controller
          AddingsController = $controller('AddingsController as vm', {
            $scope: $scope,
            addingResolve: mockAdding
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:addingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.addingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            addingId: 1
          })).toEqual('/addings/1');
        }));

        it('should attach an Adding to the controller scope', function () {
          expect($scope.vm.adding._id).toBe(mockAdding._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/addings/client/views/view-adding.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AddingsController,
          mockAdding;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('addings.create');
          $templateCache.put('modules/addings/client/views/form-adding.client.view.html', '');

          // create mock Adding
          mockAdding = new AddingsService();

          // Initialize Controller
          AddingsController = $controller('AddingsController as vm', {
            $scope: $scope,
            addingResolve: mockAdding
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.addingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/addings/create');
        }));

        it('should attach an Adding to the controller scope', function () {
          expect($scope.vm.adding._id).toBe(mockAdding._id);
          expect($scope.vm.adding._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/addings/client/views/form-adding.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AddingsController,
          mockAdding;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('addings.edit');
          $templateCache.put('modules/addings/client/views/form-adding.client.view.html', '');

          // create mock Adding
          mockAdding = new AddingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adding Name'
          });

          // Initialize Controller
          AddingsController = $controller('AddingsController as vm', {
            $scope: $scope,
            addingResolve: mockAdding
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:addingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.addingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            addingId: 1
          })).toEqual('/addings/1/edit');
        }));

        it('should attach an Adding to the controller scope', function () {
          expect($scope.vm.adding._id).toBe(mockAdding._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/addings/client/views/form-adding.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
