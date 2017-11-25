// Service that works with the APIs to do get and post requests to the database
(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.services')
    .factory('UsersService', UsersService);

  UsersService.$inject = ['$resource'];

// Function to allow the user to recieve info for sign up, reset, adn more for all the users
  function UsersService($resource) {
    var Users = $resource('/api/users', {}, {
      update: {
        method: 'PUT'
      },
      me: {
        method: 'GET',
        url: '/api/users/me'
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
      getMe: function () {
        return this.me().$promise;
      },
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
    var Profile = $resource('/api/profile', {}, {
      profileWithUsername: {
        method: 'GET',
        url: '/api/profile/:username'
      }
    });

    angular.extend(Profile, {
      getProfileWithUsername: function (username) {
        return this.profileWithUsername({ username: username }).$promise;
      }
    });

    return Profile;
  }

  angular
    .module('users.services')
    .factory('CatalogService', CatalogService);

  CatalogService.$inject = ['$resource'];

// functio nto allow the user ot get all the studnets and sponsors in the database to the controller
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

// Works wit hte edit-user.controller to delete and update the users in the database for the admin
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
