(function () {
  'use strict';

  angular
    .module('users.services')
    .factory('TransferService', TransferService);

  TransferService.$inject = ['$resource'];

  // This transfers data from one page to another
  function TransferService() {
    var savedAlternativeData = {};
    var savedRecipeData = {};

    function setAlternatives(data) {
      savedAlternativeData = data;
    }

    function getAlternatives() {
      return savedAlternativeData;
    }

    function setRecipe(data) {
      savedRecipeData = data;
    }

    function getRecipe() {
      return savedRecipeData;
    }

    return {
      setAlternatives: setAlternatives,
      getAlternatives: getAlternatives,
      setRecipe: setRecipe,
      getRecipe: getRecipe
    }
  }

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.services')
    .factory('UsersService', UsersService);

  UsersService.$inject = ['$resource'];

  function UsersService($resource) {
    var Users = $resource('/api/users', {}, {
      update: {
        method: 'PUT'
      },
      updatePassword: {
        method: 'POST',
        url: '/api/users/password'
      },
      deleteProvider: {
        method: 'DELETE',
        url: '/api/users/accounts',
        params: {
          provider: '@provider'
        }
      },
      sendPasswordResetToken: {
        method: 'POST',
        url: '/api/auth/forgot'
      },
      resetPasswordWithToken: {
        method: 'POST',
        url: '/api/auth/reset/:token'
      },
      signup: {
        method: 'POST',
        url: '/api/auth/signup'
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin'
      },
      add: {
        method: 'POST',
        url: '/api/users/add'
      },
      usda: {
        method: 'POST',
        url: '/api/users/usda'
      },
      myRecipes: {
        method: 'GET',
        url: '/api/users/myRecipes'
      },
      alternatives: {
        method: 'POST',
        url: '/api/users/alternatives'
      }
    });

    angular.extend(Users, {
      changePassword: function (passwordDetails) {
        return this.updatePassword(passwordDetails).$promise;
      },
      removeSocialAccount: function (provider) {
        return this.deleteProvider({
          provider: provider // api expects provider as a querystring parameter
        }).$promise;
      },
      requestPasswordReset: function (credentials) {
        return this.sendPasswordResetToken(credentials).$promise;
      },
      resetPassword: function (token, passwordDetails) {
        return this.resetPasswordWithToken({
          token: token // api expects token as a parameter (i.e. /:token)
        }, passwordDetails).$promise;
      },
      userSignup: function (credentials) {
        return this.signup(credentials).$promise;
      },
      userSignin: function (credentials) {
        return this.signin(credentials).$promise;
      },
      addRecipe: function(param) {
        return this.add(param).$promise;
      },
      usdaAlternatives: function(param) {
        return this.usda(param).$promise;
      },
      getMyRecipes: function() {
        return this.myRecipes().$promise;
      },
      getAlternatives: function(search) {
        return this.alternatives(search).$promise;
      }
    });

    return Users;
  }

  // TODO this should be Users service
  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
    return $resource('/api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
