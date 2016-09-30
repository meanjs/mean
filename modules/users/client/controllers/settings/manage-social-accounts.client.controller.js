(function () {
  'use strict';

  angular
    .module('users')
    .controller('SocialAccountsController', SocialAccountsController);

  SocialAccountsController.$inject = ['$scope', 'UsersService', 'Authentication', 'Notification'];

  function SocialAccountsController($scope, UsersService, Authentication, Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.hasConnectedAdditionalSocialAccounts = hasConnectedAdditionalSocialAccounts;
    vm.isConnectedSocialAccount = isConnectedSocialAccount;
    vm.removeUserSocialAccount = removeUserSocialAccount;

    // Check if there are additional accounts
    function hasConnectedAdditionalSocialAccounts() {
      return (vm.user.additionalProvidersData && Object.keys(vm.user.additionalProvidersData).length);
    }

    // Check if provider is already in use with current user
    function isConnectedSocialAccount(provider) {
      return vm.user.provider === provider || (vm.user.additionalProvidersData && vm.user.additionalProvidersData[provider]);
    }

    // Remove a user social account
    function removeUserSocialAccount(provider) {

      UsersService.removeSocialAccount(provider)
        .then(onRemoveSocialAccountSuccess)
        .catch(onRemoveSocialAccountError);
    }

    function onRemoveSocialAccountSuccess(response) {
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Removed successfully!' });
      vm.user = Authentication.user = response;
    }

    function onRemoveSocialAccountError(response) {
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Remove failed!' });
    }
  }
}());
