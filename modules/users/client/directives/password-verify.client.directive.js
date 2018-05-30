(() => {
  angular
    .module('users')
    .directive('passwordVerify', passwordVerify);

  function passwordVerify() {
    const directive = {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      const status = true;
      scope.$watch(() => {
        let combined;
        if (scope.passwordVerify || ngModel) {
          combined = scope.passwordVerify + '_' + ngModel;
        }
        return combined;
      }, value => {
        if (value) {
          ngModel.$validators.passwordVerify = password => {
            const origin = scope.passwordVerify;
            return (origin === password);
          };
        }
      });
    }
  }
})();
