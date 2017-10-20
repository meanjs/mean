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
      getUnapprovedUsers: {
        method: 'GET',
        url: '/api/users/unapproved'
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
      getAllUnapprovedUsers: function () {
        return this.getUnapprovedUsers().$promise;
      },
      approvalSwap: function () {
        return this.approvalSwap().$promise;
      },
      remove: function () {
        return this.remove().$promise;
      },
    });

    return Users;
  }

  angular
    .module('users.admin.services')
    .factory('ApplicantsService', ApplicantsService);

  ApplicantsService.$inject = ['$resource'];

  function ApplicantsService($resource) {
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
      getUnapprovedUsers: {
        method: 'GET',
        url: '/api/users/unapproved'
      },
      approvalSwap: {
        method: 'PUT',
        url: '/api/users/unapproved'
      },
      remove: {
        method: 'DELETE',
        url: '/api/users/unapproved'
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

    var Applicants = $resource('/api/unapproved', {}, {
      delete: {
        method: 'DELETE',
        url: '/api/admin/unapproved'
      },
      approvalSwap: {
        method: 'PUT',
        url: '/api/admin/unapproved'
      }
    });

    angular.extend(Users, {
      deleteApplicant: function () {
        return this.delete().$promise;
      },
      approvalSwap: function () {
        return this.approvalSwap().$promise;
      }
    });

    return Applicants;
  }

  // TODO this should be Users service
  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  //Try angular.extending a new thing onto the user prototype so we can approve or disapprove
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
