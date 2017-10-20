(function () {
  'use strict';

  describe('Recipedetails Route Tests', function () {
    // Initialize global variables
    var $scope,
      RecipedetailsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RecipedetailsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RecipedetailsService = _RecipedetailsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('recipedetails');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/recipedetails');
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
          RecipedetailsController,
          mockRecipedetail;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('recipedetails.view');
          $templateCache.put('modules/recipedetails/client/views/view-recipedetail.client.view.html', '');

          // create mock Recipedetail
          mockRecipedetail = new RecipedetailsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Recipedetail Name'
          });

          // Initialize Controller
          RecipedetailsController = $controller('RecipedetailsController as vm', {
            $scope: $scope,
            recipedetailResolve: mockRecipedetail
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:recipedetailId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.recipedetailResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            recipedetailId: 1
          })).toEqual('/recipedetails/1');
        }));

        it('should attach an Recipedetail to the controller scope', function () {
          expect($scope.vm.recipedetail._id).toBe(mockRecipedetail._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/recipedetails/client/views/view-recipedetail.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RecipedetailsController,
          mockRecipedetail;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('recipedetails.create');
          $templateCache.put('modules/recipedetails/client/views/form-recipedetail.client.view.html', '');

          // create mock Recipedetail
          mockRecipedetail = new RecipedetailsService();

          // Initialize Controller
          RecipedetailsController = $controller('RecipedetailsController as vm', {
            $scope: $scope,
            recipedetailResolve: mockRecipedetail
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.recipedetailResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/recipedetails/create');
        }));

        it('should attach an Recipedetail to the controller scope', function () {
          expect($scope.vm.recipedetail._id).toBe(mockRecipedetail._id);
          expect($scope.vm.recipedetail._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/recipedetails/client/views/form-recipedetail.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RecipedetailsController,
          mockRecipedetail;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('recipedetails.edit');
          $templateCache.put('modules/recipedetails/client/views/form-recipedetail.client.view.html', '');

          // create mock Recipedetail
          mockRecipedetail = new RecipedetailsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Recipedetail Name'
          });

          // Initialize Controller
          RecipedetailsController = $controller('RecipedetailsController as vm', {
            $scope: $scope,
            recipedetailResolve: mockRecipedetail
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:recipedetailId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.recipedetailResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            recipedetailId: 1
          })).toEqual('/recipedetails/1/edit');
        }));

        it('should attach an Recipedetail to the controller scope', function () {
          expect($scope.vm.recipedetail._id).toBe(mockRecipedetail._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/recipedetails/client/views/form-recipedetail.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
