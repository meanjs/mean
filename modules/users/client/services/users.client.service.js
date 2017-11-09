(function () {
  'use strict';

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

  // TODO this should be Users service
  angular
    .module('users.services')
    .factory('ProfileService', ProfileService);

  ProfileService.$inject = ['$resource'];

  function ProfileService($resource) {
    return $resource('/api/profile/:username', {
      username: '@username'
    }, {
      get: {
        method: 'GET'
      }
    });
  }

  angular
    .module('users.services')
    .factory('CatalogService', CatalogService);

  CatalogService.$inject = ['$resource'];

  function CatalogService($resource) {
    var Catalog = $resource('/api/catalog', {}, {
      getStudents: {
        method: 'GET',
        url: '/api/catalog/students',
        isArray: true
      },
      getSponsors: {
        method: 'GET',
        url: '/api/catalog/sponsors',
        isArray: true
      }
    });

    angular.extend(Catalog, {
      sponsorGetStudents: function () {
        return this.getStudents().$promise;
      },
      adminGetSponsors: function () {
        return this.getSponsors().$promise;
      }
    });

    return Catalog;
  }

  angular
    .module('users.services')
    .factory('AdminPowers', AdminPowers);

  AdminPowers.$inject = ['$resource'];

  function AdminPowers($resource) {
    var Admin = $resource('/api/admin', {}, {
      updateUser: {
        method: 'PUT',
        url: '/api/admin/updateUser'
      },
      deleteUser: {
        method: 'DELETE',
        url: '/api/admin/deleteUser'
      }
    });

    angular.extend(Admin, {
      adminUpdateUser: function (user) {
        return this.updateUser(user).$promise;
      },
      adminDeleteUser: function (user) {
        return this.deleteUser(user).$promise;
      }
    });

    return Admin;
  }
}());
