(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        url: '/settings', // SETTINGS
        templateUrl: '/modules/users/client/views/settings/settings.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('profile', { // MY PROFILE
        url: '/profile',
        templateUrl: '/modules/users/client/views/settings/edit-profile.client.view.html',
        controller: 'EditProfileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Profile'
        }
      })
      .state('add', { // ADD RECIPES
        url: '/add-recipe',
        templateUrl: 'modules/users/client/views/recipes/addRecipe.client.view.html',
        controller: 'AddRecipeController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Add Recipe'
        },
        css: 'modules/users/client/css/recipes/addRecipe.css'
      })
      .state('my-recipes', { // MY RECIPES
        url: '/my-recipes',
        templateUrl: 'modules/users/client/views/recipes/myRecipes.client.view.html',
        controller: 'MyRecipesController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'My Recipes'
        },
        css: 'modules/users/client/css/recipes/myRecipes.css'
      })
      .state('details', { // RECIPE DETAILS
        url: '/recipe-details',
        templateUrl: 'modules/users/client/views/recipes/recipeDetails.client.view.html',
        controller: 'RecipeDetailsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Recipe Details'
        },
        css: 'modules/users/client/css/recipes/recipeDetails.css'
      })
      .state('alternatives', { // SUGGESTED ALTERNATIVES
        url: '/alternatives',
        templateUrl: 'modules/users/client/views/recipes/alternatives.client.view.html',
        controller: 'AlternativesController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Alternatives'
        },
        css: 'modules/users/client/css/recipes/addRecipe.css'
      })
      .state('customize', { // CUSTOMIZE A RECIPE
        url: '/customize',
        templateUrl: 'modules/users/client/views/recipes/customize.client.view.html',
        controller: 'CustomizeController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Customize'
        },
        css: 'modules/users/client/css/recipes/customize.css'
      })
      .state('healthprofile', { // HEALTH PROFILE
        url: '/healthprofile',
        templateUrl: '/modules/users/client/views/settings/edit-health-profile.client.view.html',
        controller: 'EditHealthProfileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Health Profile'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: '/modules/users/client/views/settings/change-password.client.view.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Change Password'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: '/modules/users/client/views/settings/manage-social-accounts.client.view.html',
        controller: 'SocialAccountsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Social Accounts'
        }
      })
      .state('profile.picture', {
        url: '/picture',
        templateUrl: '/modules/users/client/views/settings/change-profile-picture.client.view.html',
        controller: 'ChangeProfilePictureController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Change Picture'
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: '/modules/users/client/views/authentication/signup.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: '/modules/users/client/views/authentication/signin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signin'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: '/modules/users/client/views/password/forgot-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Forgot Password'
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: '/modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'Password reset invalid'
        }
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: '/modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'Password reset success'
        }
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: '/modules/users/client/views/password/reset-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password reset form'
        }
      });
  }
}());
