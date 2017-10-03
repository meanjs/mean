(function () {
  'use strict';

  describe('Recipes Route Tests', function () {
    // Initialize global variables
    var $scope,
      RecipesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RecipesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RecipesService = _RecipesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('recipes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/recipes');
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
          RecipesController,
          mockRecipe;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('recipes.view');
          $templateCache.put('modules/recipes/client/views/view-recipe.client.view.html', '');

          // create mock Recipe
          mockRecipe = new RecipesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Recipe Name'
          });

          // Initialize Controller
          RecipesController = $controller('RecipesController as vm', {
            $scope: $scope,
            recipeResolve: mockRecipe
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:recipeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.recipeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            recipeId: 1
          })).toEqual('/recipes/1');
        }));

        it('should attach an Recipe to the controller scope', function () {
          expect($scope.vm.recipe._id).toBe(mockRecipe._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/recipes/client/views/view-recipe.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RecipesController,
          mockRecipe;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('recipes.create');
          $templateCache.put('modules/recipes/client/views/form-recipe.client.view.html', '');

          // create mock Recipe
          mockRecipe = new RecipesService();

          // Initialize Controller
          RecipesController = $controller('RecipesController as vm', {
            $scope: $scope,
            recipeResolve: mockRecipe
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.recipeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/recipes/create');
        }));

        it('should attach an Recipe to the controller scope', function () {
          expect($scope.vm.recipe._id).toBe(mockRecipe._id);
          expect($scope.vm.recipe._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/recipes/client/views/form-recipe.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RecipesController,
          mockRecipe;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('recipes.edit');
          $templateCache.put('modules/recipes/client/views/form-recipe.client.view.html', '');

          // create mock Recipe
          mockRecipe = new RecipesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Recipe Name'
          });

          // Initialize Controller
          RecipesController = $controller('RecipesController as vm', {
            $scope: $scope,
            recipeResolve: mockRecipe
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:recipeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.recipeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            recipeId: 1
          })).toEqual('/recipes/1/edit');
        }));

        it('should attach an Recipe to the controller scope', function () {
          expect($scope.vm.recipe._id).toBe(mockRecipe._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/recipes/client/views/form-recipe.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
