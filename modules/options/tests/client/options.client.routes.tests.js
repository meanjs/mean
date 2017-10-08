(function () {
  'use strict';

  describe('Options Route Tests', function () {
    // Initialize global variables
    var $scope,
      OptionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OptionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OptionsService = _OptionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('options');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/options');
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
          OptionsController,
          mockOption;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('options.view');
          $templateCache.put('modules/options/client/views/view-option.client.view.html', '');

          // create mock Option
          mockOption = new OptionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Option Name'
          });

          // Initialize Controller
          OptionsController = $controller('OptionsController as vm', {
            $scope: $scope,
            optionResolve: mockOption
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:optionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.optionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            optionId: 1
          })).toEqual('/options/1');
        }));

        it('should attach an Option to the controller scope', function () {
          expect($scope.vm.option._id).toBe(mockOption._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/options/client/views/view-option.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OptionsController,
          mockOption;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('options.create');
          $templateCache.put('modules/options/client/views/form-option.client.view.html', '');

          // create mock Option
          mockOption = new OptionsService();

          // Initialize Controller
          OptionsController = $controller('OptionsController as vm', {
            $scope: $scope,
            optionResolve: mockOption
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.optionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/options/create');
        }));

        it('should attach an Option to the controller scope', function () {
          expect($scope.vm.option._id).toBe(mockOption._id);
          expect($scope.vm.option._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/options/client/views/form-option.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OptionsController,
          mockOption;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('options.edit');
          $templateCache.put('modules/options/client/views/form-option.client.view.html', '');

          // create mock Option
          mockOption = new OptionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Option Name'
          });

          // Initialize Controller
          OptionsController = $controller('OptionsController as vm', {
            $scope: $scope,
            optionResolve: mockOption
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:optionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.optionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            optionId: 1
          })).toEqual('/options/1/edit');
        }));

        it('should attach an Option to the controller scope', function () {
          expect($scope.vm.option._id).toBe(mockOption._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/options/client/views/form-option.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
