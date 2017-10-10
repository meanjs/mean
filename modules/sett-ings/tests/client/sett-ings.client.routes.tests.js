(function () {
  'use strict';

  describe('Sett ings Route Tests', function () {
    // Initialize global variables
    var $scope,
      SettIngsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SettIngsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SettIngsService = _SettIngsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sett-ings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sett-ings');
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
          SettIngsController,
          mockSettIng;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sett-ings.view');
          $templateCache.put('modules/sett-ings/client/views/view-sett-ing.client.view.html', '');

          // create mock Sett ing
          mockSettIng = new SettIngsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sett ing Name'
          });

          // Initialize Controller
          SettIngsController = $controller('SettIngsController as vm', {
            $scope: $scope,
            settIngResolve: mockSettIng
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:settIngId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.settIngResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            settIngId: 1
          })).toEqual('/sett-ings/1');
        }));

        it('should attach an Sett ing to the controller scope', function () {
          expect($scope.vm.settIng._id).toBe(mockSettIng._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sett-ings/client/views/view-sett-ing.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SettIngsController,
          mockSettIng;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sett-ings.create');
          $templateCache.put('modules/sett-ings/client/views/form-sett-ing.client.view.html', '');

          // create mock Sett ing
          mockSettIng = new SettIngsService();

          // Initialize Controller
          SettIngsController = $controller('SettIngsController as vm', {
            $scope: $scope,
            settIngResolve: mockSettIng
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.settIngResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sett-ings/create');
        }));

        it('should attach an Sett ing to the controller scope', function () {
          expect($scope.vm.settIng._id).toBe(mockSettIng._id);
          expect($scope.vm.settIng._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sett-ings/client/views/form-sett-ing.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SettIngsController,
          mockSettIng;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sett-ings.edit');
          $templateCache.put('modules/sett-ings/client/views/form-sett-ing.client.view.html', '');

          // create mock Sett ing
          mockSettIng = new SettIngsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sett ing Name'
          });

          // Initialize Controller
          SettIngsController = $controller('SettIngsController as vm', {
            $scope: $scope,
            settIngResolve: mockSettIng
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:settIngId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.settIngResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            settIngId: 1
          })).toEqual('/sett-ings/1/edit');
        }));

        it('should attach an Sett ing to the controller scope', function () {
          expect($scope.vm.settIng._id).toBe(mockSettIng._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sett-ings/client/views/form-settIng.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
